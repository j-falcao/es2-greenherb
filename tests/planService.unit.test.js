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

  test('TU33 creates a regular plan for an existing herb and user', () => {
    const herb = importHerb();

    const plan = planService.createPlan({
      userId: '1',
      herbId: herb.id,
      type: 'regular',
      startDate: '2026-05-13',
      notes: 'Balcony pot'
    });

    expect(plan).toEqual({
      id: '1',
      userId: '1',
      herbId: '1',
      type: 'regular',
      startDate: '2026-05-13',
      notes: 'Balcony pot',
      expectedHarvestDate: '2026-07-12'
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
    ['TU41', 'emergencia'],
    ['TU42', 'pontual']
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
});
