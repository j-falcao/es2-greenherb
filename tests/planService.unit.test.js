const herbService = require('../src/services/herbService');
const herbRepository = require('../src/repositories/herbRepository');
const planService = require('../src/services/planService');
const planRepository = require('../src/repositories/planRepository');

describe('planService unit tests', () => {
  beforeEach(() => {
    herbRepository.reset();
    planRepository.reset();
  });

  function importHerb() {
    return herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60'
    )[0];
  }

  const responsavel = { id: '2', username: 'rita_resp', role: 'Responsavel' };

  test('TU33 creates a regular plan for an existing herb and user', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'regular',
      startDate: '2026-05-13',
      notes: 'Balcony pot'
    });

    expect(plan).toMatchObject({
      id: '1',
      userId: '1',
      herbId: '1',
      type: 'regular',
      startDate: '2026-05-13',
      notes: 'Balcony pot',
      cycleDurationDays: 60,
      expectedHarvestDate: '2026-07-12'
    });
    expect(plan.environmentLimits).toEqual({
      temperature: { min: 18, max: 28 },
      humidity: { min: 40, max: 80 },
      luminosity: { min: 5000, max: 25000 }
    });
  });

  test('TU34 calculates expectedHarvestDate from startDate plus harvestDays', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-01-01'
    });

    expect(plan.type).toBe('regular');
    expect(plan.expectedHarvestDate).toBe('2026-03-02');
  });

  test('TU35 rejects unknown herb id', () => {
    expect(() => planService.createPlan({
      userId: '1',
      herbId: '999',
      startDate: '2026-05-13'
    })).toThrow(expect.objectContaining({
      statusCode: 404
    }));
  });

  test.each([
    ['TU36', null],
    ['TU37', ''],
    ['TU38', '13-05-2026'],
    ['TU39', '2026-02-30']
  ])('%s rejects missing or invalid start date', (testId, startDate) => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate
    })).toThrow(expect.objectContaining({
      statusCode: 400
    }));
  });

  test.each([
    ['TU40', 'regular'],
    ['TU41', 'emergencia']
  ])('%s creates %s cultivation plan type', (testId, type) => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type,
      startDate: '2026-05-13'
    });

    expect(plan.type).toBe(type);
  });

  test('TU42 creates pontual cultivation plan type with explicit authorization', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: responsavel.id,
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      technicalResponsibleAuthorization: true,
      user: responsavel
    });

    expect(plan.type).toBe('pontual');
    expect(plan.pontualAuthorization).toMatchObject({
      authorizedBy: responsavel.id
    });
  });

  test('TU124 creates pontual plan with explicit technical responsible authorization', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      technicalResponsibleAuthorization: true,
      user: { id: '1', username: 'tech', role: 'Tecnico' }
    });

    expect(plan.type).toBe('pontual');
    expect(plan.pontualAuthorization).toMatchObject({
      authorizedBy: '1'
    });
  });

  test('TU43 rejects invalid cultivation plan type', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'weekly',
      startDate: '2026-05-13'
    })).toThrow(expect.objectContaining({
      statusCode: 400
    }));
  });

  test('TU82 rejects pontual plan without explicit authorization', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      user: responsavel
    })).toThrow(expect.objectContaining({ statusCode: 403 }));
  });

  test.each([
    ['TU83', 'temperature', 'min', 17],
    ['TU84', 'temperature', 'min', 18],
    ['TU85', 'temperature', 'max', 23],
    ['TU86', 'temperature', 'max', 28],
    ['TU87', 'temperature', 'max', 29],
    ['TU88', 'humidity', 'min', 39],
    ['TU89', 'humidity', 'min', 40],
    ['TU90', 'humidity', 'max', 60],
    ['TU91', 'humidity', 'max', 80],
    ['TU92', 'humidity', 'max', 81],
    ['TU93', 'luminosity', 'min', 4999],
    ['TU94', 'luminosity', 'min', 5000],
    ['TU95', 'luminosity', 'max', 15000],
    ['TU96', 'luminosity', 'max', 25000],
    ['TU97', 'luminosity', 'max', 25001]
  ])('%s validates environmental boundary for %s.%s=%s', (testId, metric, side, value) => {
    const herb = importHerb();
    const environmentLimits = {
      [metric]: {
        min: metric === 'temperature' ? 18 : metric === 'humidity' ? 40 : 5000,
        max: metric === 'temperature' ? 28 : metric === 'humidity' ? 80 : 25000,
        [side]: value
      }
    };
    const shouldReject = value < planService.LIMIT_RANGES[metric].min
      || value > planService.LIMIT_RANGES[metric].max;
    const action = () => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits
    });

    if (shouldReject) {
      expect(action).toThrow(expect.objectContaining({ statusCode: 400 }));
    } else {
      expect(action()).toMatchObject({ environmentLimits: expect.any(Object) });
    }
  });

  test.each([
    ['TU98', 0, false],
    ['TU99', 1, true],
    ['TU100', 90, true],
    ['TU101', 365, true],
    ['TU102', 366, false]
  ])('%s validates cycleDurationDays boundary %s', (testId, cycleDurationDays, valid) => {
    const herb = importHerb();
    const action = () => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      cycleDurationDays
    });

    if (valid) {
      expect(action().cycleDurationDays).toBe(cycleDurationDays);
    } else {
      expect(action).toThrow(expect.objectContaining({ statusCode: 400 }));
    }
  });

  test('TU49 lists created plans', () => {
    const herb = importHerb();

    planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13'
    });

    expect(planService.listPlans()).toHaveLength(1);
  });

  test('TU50 gets a plan by id', () => {
    const herb = importHerb();
    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13'
    });

    expect(planService.getPlanById(plan.id)).toEqual(plan);
  });

  test('TU51 rejects missing plan id', () => {
    expect(() => planService.getPlanById('999')).toThrow(
      expect.objectContaining({ statusCode: 404 })
    );
  });
});
