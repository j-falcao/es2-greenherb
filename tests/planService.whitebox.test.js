const herbService = require('../src/services/herbService');
const herbRepository = require('../src/repositories/herbRepository');
const planService = require('../src/services/planService');
const planRepository = require('../src/repositories/planRepository');
const auditRepository = require('../src/repositories/auditRepository');

describe('planService white-box plan creation tests', () => {
  beforeEach(() => {
    herbRepository.reset();
    planRepository.reset();
    auditRepository.reset();
  });

  function importHerb() {
    const herb = herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60'
    )[0];
    auditRepository.reset();
    return herb;
  }

  test('TW-01 covers valid regular plan defaults and false validation branches', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13'
    });

    expect(plan).toMatchObject({
      id: '1',
      userId: '1',
      herbId: herb.id,
      type: 'regular',
      startDate: '2026-05-13',
      notes: null,
      cycleDurationDays: 60,
      expectedHarvestDate: '2026-07-12',
      pontualAuthorization: null
    });
    expect(plan.environmentLimits).toEqual({
      temperature: { min: 18, max: 28 },
      humidity: { min: 40, max: 80 },
      luminosity: { min: 5000, max: 25000 }
    });
    expect(auditRepository.findAll()[0]).toMatchObject({
      userId: '1',
      username: null,
      action: 'create',
      resource: 'plans',
      resourceId: plan.id
    });
  });

  test('TW-02 covers unknown herb early rejection', () => {
    expect(() => planService.createPlan({
      userId: '1',
      herbId: '999',
      startDate: '2026-05-13'
    })).toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  test('TW-03 covers non-string startDate rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: null
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-04 covers invalid startDate format rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '13-05-2026'
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-05 covers parseable date rollover rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-02-30'
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-06 covers invalid Date object rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-13-01'
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-07 covers invalid plan type rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'weekly',
      startDate: '2026-05-13'
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-08 covers explicit cycle duration, notes, and audit user branches', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      cycleDurationDays: 90,
      notes: 'Balcony pot',
      user: { id: '7', username: 'ana' }
    });

    expect(plan).toMatchObject({
      notes: 'Balcony pot',
      cycleDurationDays: 90,
      expectedHarvestDate: '2026-08-11'
    });
    expect(auditRepository.findAll()[0]).toMatchObject({
      userId: '7',
      username: 'ana'
    });
  });

  test('TW-09 covers pontual authorization creation with truthy user id', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '2',
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      technicalResponsibleAuthorization: true,
      user: { id: '2', username: 'rita_resp' }
    });

    expect(plan.type).toBe('pontual');
    expect(plan.pontualAuthorization).toMatchObject({
      authorizedBy: '2'
    });
    expect(plan.pontualAuthorization.authorizedAt).toEqual(expect.any(String));
  });

  test('TW-10 covers pontual plan rejection without explicit authorization', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '2',
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      user: { id: '2', username: 'rita_resp' }
    })).toThrow(expect.objectContaining({ statusCode: 403 }));
  });

  test('TW-11 covers pontual authorization with falsy user id and username', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: 'fallback-user',
      herbId: herb.id,
      type: 'pontual',
      startDate: '2026-05-13',
      technicalResponsibleAuthorization: true,
      user: { id: '', username: '' }
    });

    expect(plan.pontualAuthorization).toMatchObject({
      authorizedBy: null
    });
    expect(auditRepository.findAll()[0]).toMatchObject({
      userId: 'fallback-user',
      username: null
    });
  });

  test('TW-12 covers environment minimum below allowed range', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits: { temperature: { min: 17 } }
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-13 covers environment maximum above allowed range', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits: { temperature: { max: 29 } }
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-14 covers exact environmental boundary acceptance', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits: { temperature: { min: 18, max: 28 } }
    });

    expect(plan.environmentLimits.temperature).toEqual({ min: 18, max: 28 });
  });

  test('TW-15 covers environment interval inversion rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits: { temperature: { min: 25, max: 20 } }
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-16 covers non-numeric environment value rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      environmentLimits: { temperature: { min: 'hot' } }
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-17 covers non-integer cycle duration rejection', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      cycleDurationDays: 10.5
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-18 covers cycle duration below allowed range', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      cycleDurationDays: 0
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-19 covers cycle duration above allowed range', () => {
    const herb = importHerb();

    expect(() => planService.createPlan({
      userId: '1',
      herbId: herb.id,
      startDate: '2026-05-13',
      cycleDurationDays: 366
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });
});
