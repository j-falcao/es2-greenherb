const alertService = require('../src/services/alertService');

describe('alertService white-box alert classification tests', () => {
  const environmentLimits = {
    temperature: { min: 18, max: 28 },
    humidity: { min: 40, max: 80 },
    luminosity: { min: 5000, max: 25000 }
  };

  function classify(overrides = {}, sensorOK = true) {
    return alertService.classifyMeasurementAlert({
      measurement: {
        temperature: 23,
        humidity: 60,
        luminosity: 15000,
        ...overrides
      },
      environmentLimits,
      sensorOK
    });
  }

  test('TW-20 classifies unreliable sensor data as informativo', () => {
    expect(classify({}, false)).toEqual({
      type: 'informativo',
      violations: ['sensor_unreliable']
    });
  });

  test('TW-21 classifies zero environmental violations as informativo', () => {
    expect(classify()).toEqual({
      type: 'informativo',
      violations: []
    });
  });

  test('TW-22 classifies exactly one environmental violation as aviso', () => {
    expect(classify({ temperature: 29 })).toEqual({
      type: 'aviso',
      violations: ['temperature_above_max']
    });
  });

  test('TW-23 classifies multiple environmental violations as critico', () => {
    expect(classify({ temperature: 29, humidity: 39 })).toEqual({
      type: 'critico',
      violations: ['temperature_above_max', 'humidity_below_min']
    });
  });

  test('TW-24 detects temperature below minimum', () => {
    expect(classify({ temperature: 17 }).violations).toEqual(['temperature_below_min']);
  });

  test('TW-25 detects humidity above maximum', () => {
    expect(classify({ humidity: 81 }).violations).toEqual(['humidity_above_max']);
  });

  test('TW-26 detects luminosity below minimum', () => {
    expect(classify({ luminosity: 4999 }).violations).toEqual(['luminosity_below_min']);
  });

  test('TW-27 detects luminosity above maximum', () => {
    expect(classify({ luminosity: 25001 }).violations).toEqual(['luminosity_above_max']);
  });
});
