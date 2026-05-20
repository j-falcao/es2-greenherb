const alertRepository = require('../src/repositories/alertRepository');
const auditRepository = require('../src/repositories/auditRepository');
const alertService = require('../src/services/alertService');

describe('alertService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    alertRepository.reset();
    auditRepository.reset();
  });

  test('TU67 creates an alert', () => {
    const alert = alertService.createAlert({
      type: 'critico',
      message: 'High temperature',
      user
    });

    expect(alert).toMatchObject({
      id: '1',
      type: 'critico',
      message: 'High temperature',
      status: 'ativo',
      resolution: null,
      ignoredJustification: null
    });
  });

  test('TU125 creates an informativo alert', () => {
    const alert = alertService.createAlert({
      type: 'informativo',
      message: 'Sensor offline',
      user
    });

    expect(alert).toMatchObject({
      type: 'informativo',
      message: 'Sensor offline',
      status: 'ativo'
    });
  });

  test('TU126 rejects invalid alert classification', () => {
    expect(() => alertService.createAlert({
      type: 'urgente',
      message: 'Unknown classification',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TU68 lists and gets alerts by id', () => {
    const alert = alertService.createAlert({
      type: 'aviso',
      message: 'Low humidity',
      user
    });

    expect(alertService.listAlerts()).toHaveLength(1);
    expect(alertService.getAlertById(alert.id)).toEqual(alert);
  });

  test('TU69 resolves an alert', () => {
    const alert = alertService.createAlert({
      type: 'critico',
      message: 'High temperature',
      user
    });

    const resolvedAlert = alertService.resolveAlert({
      id: alert.id,
      resolution: 'Handled',
      user
    });

    expect(resolvedAlert.status).toBe('resolvido');
    expect(resolvedAlert.resolution).toBe('Handled');
  });

  test('TU70 ignores an alert with justification', () => {
    const alert = alertService.createAlert({
      type: 'aviso',
      message: 'Low humidity',
      user
    });

    const ignoredAlert = alertService.ignoreAlert({
      id: alert.id,
      justification: 'False positive',
      user
    });

    expect(ignoredAlert.status).toBe('ignorado');
    expect(ignoredAlert.ignoredJustification).toBe('False positive');
  });

  test('TU71 rejects alert ignore without justification', () => {
    const alert = alertService.createAlert({
      type: 'aviso',
      message: 'Low humidity',
      user
    });

    expect(() => alertService.ignoreAlert({
      id: alert.id,
      justification: '',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test.each([
    ['TU106', '123456789', false],
    ['TU107', '1234567890', true],
    ['TU108', 'a'.repeat(250), true],
    ['TU109', 'a'.repeat(500), true],
    ['TU110', 'a'.repeat(501), false]
  ])('%s validates ignore justification length', (testId, justification, valid) => {
    const alert = alertService.createAlert({
      type: 'aviso',
      message: 'Low humidity',
      user
    });
    const action = () => alertService.ignoreAlert({
      id: alert.id,
      justification,
      user
    });

    if (valid) {
      expect(action().ignoredJustification).toBe(justification);
    } else {
      expect(action).toThrow(expect.objectContaining({ statusCode: 400 }));
    }
  });

  test.each([
    ['TU111', 23, 60, true, 'informativo'],
    ['TU112', 29, 60, true, 'aviso'],
    ['TU113', 29, 39, true, 'critico'],
    ['TU114', 23, 60, false, 'informativo']
  ])('%s classifies measurement alerts with compound conditions', (
    testId,
    temperature,
    humidity,
    sensorOK,
    expectedType
  ) => {
    const result = alertService.classifyMeasurementAlert({
      measurement: { temperature, humidity, luminosity: 15000 },
      environmentLimits: {
        temperature: { min: 18, max: 28 },
        humidity: { min: 40, max: 80 },
        luminosity: { min: 5000, max: 25000 }
      },
      sensorOK
    });

    expect(result.type).toBe(expectedType);
  });
});
