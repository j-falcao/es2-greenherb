const auditRepository = require('../src/repositories/auditRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const planRepository = require('../src/repositories/planRepository');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const planService = require('../src/services/planService');

describe('batchService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    planRepository.reset();
  });

  function createPlan() {
    const herb = herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60',
      user
    )[0];

    return planService.createPlan({
      userId: user.id,
      herbId: herb.id,
      startDate: '2026-05-13',
      user
    });
  }

  test('TU52 creates a batch for an existing plan', () => {
    const plan = createPlan();

    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      expectedYield: 40,
      user
    });

    expect(batch).toMatchObject({
      id: '1',
      planId: '1',
      code: 'BATCH-001',
      startDate: '2026-05-14',
      status: 'ativo',
      expectedYield: 40,
      actualEndDate: null,
      divisions: [],
      losses: [],
      productivity: null
    });
  });

  test('TU53 lists and gets batches by id', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    expect(batchService.listBatches()).toHaveLength(1);
    expect(batchService.getBatchById(batch.id)).toEqual(batch);
  });

  test('TU54 rejects batch creation for unknown plan', () => {
    expect(() => batchService.createBatch({
      planId: '999',
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    })).toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  test('TU55 updates batch status', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    expect(batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      actualEndDate: '2026-07-13',
      user
    }).status).toBe('concluido');
  });

  test('TU56 rejects invalid batch status', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'paused',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TU57 adds divisions, losses, and calculates productivity for a batch', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      expectedYield: 40,
      user
    });

    expect(batchService.addDivision({
      id: batch.id,
      name: 'A1',
      area: 12,
      user
    }).divisions).toHaveLength(1);
    expect(batchService.addLoss({
      id: batch.id,
      quantity: 2,
      reason: 'damaged',
      date: '2026-05-15',
      user
    }).losses).toHaveLength(1);
    expect(batchService.updateProductivity({
      id: batch.id,
      harvestedQuantity: 36,
      plannedDurationDays: 60,
      actualDurationDays: 60,
      user
    }).productivity).toBe(85);
  });

  test('TU115 rejects concluding a batch without actualEndDate', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TU116 rejects compromising a batch before losses are registered', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TU117 allows compromising a batch after losses are registered', () => {
    const plan = createPlan();
    const batch = batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });

    batchService.addLoss({
      id: batch.id,
      quantity: 2,
      reason: 'damaged',
      date: '2026-05-15',
      user
    });

    expect(batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    }).status).toBe('comprometido');
  });
});
