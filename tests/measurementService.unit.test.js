const auditRepository = require('../src/repositories/auditRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const measurementRepository = require('../src/repositories/measurementRepository');
const planRepository = require('../src/repositories/planRepository');
const alertRepository = require('../src/repositories/alertRepository');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const measurementService = require('../src/services/measurementService');
const planService = require('../src/services/planService');

describe('measurementService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    measurementRepository.reset();
    planRepository.reset();
    alertRepository.reset();
  });

  function createBatch() {
    const herb = herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60',
      user
    )[0];
    const plan = planService.createPlan({
      userId: user.id,
      herbId: herb.id,
      startDate: '2026-05-13',
      user
    });

    return batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });
  }

  test('TU63 creates an environmental measurement', () => {
    const batch = createBatch();

    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 21.5,
      humidity: 70,
      luminosity: 15000,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });

    expect(measurement).toMatchObject({
      id: '1',
      batchId: '1',
      temperature: 21.5,
      humidity: 70,
      luminosity: 15000,
      sensorOK: true,
      measuredAt: '2026-05-14T10:00:00.000Z'
    });
    expect(measurement.generatedAlert).toBeNull();
  });

  test('TU64 lists and gets measurements by id', () => {
    const batch = createBatch();
    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 21.5,
      humidity: 70,
      luminosity: 15000,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });

    expect(measurementService.listMeasurements()).toHaveLength(1);
    expect(measurementService.getMeasurementById(measurement.id)).toEqual({
      id: measurement.id,
      batchId: measurement.batchId,
      temperature: measurement.temperature,
      humidity: measurement.humidity,
      luminosity: measurement.luminosity,
      sensorOK: measurement.sensorOK,
      measuredAt: measurement.measuredAt
    });
  });

  test('TU65 rejects measurement creation for unknown batch', () => {
    expect(() => measurementService.createMeasurement({
      batchId: '999',
      temperature: 21.5,
      humidity: 70,
      luminosity: 400,
      user
    })).toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  test('TU66 rejects invalid measurement values', () => {
    const batch = createBatch();

    expect(() => measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 'warm',
      humidity: 70,
      luminosity: 400,
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TU103 generates an aviso alert when one measurement is outside plan limits', () => {
    const batch = createBatch();

    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 29,
      humidity: 70,
      luminosity: 15000,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });

    expect(measurement.generatedAlert).toMatchObject({
      type: 'aviso',
      resource: 'measurements',
      resourceId: measurement.id
    });
  });

  test('TU104 generates a critico alert when multiple measurements are outside plan limits', () => {
    const batch = createBatch();

    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 29,
      humidity: 39,
      luminosity: 15000,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });

    expect(measurement.generatedAlert.type).toBe('critico');
  });

  test('TU105 creates an informativo alert for unreliable sensor data', () => {
    const batch = createBatch();

    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 21,
      humidity: 60,
      luminosity: 15000,
      sensorOK: false,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });

    expect(measurement.generatedAlert).toMatchObject({
      type: 'informativo'
    });
  });
});
