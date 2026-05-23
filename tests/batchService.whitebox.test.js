const auditRepository = require('../src/repositories/auditRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const planRepository = require('../src/repositories/planRepository');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const planService = require('../src/services/planService');

describe('batchService white-box status transition tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    planRepository.reset();
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
      code: 'BATCH-WB',
      startDate: '2026-05-14',
      user
    });
  }

  test('TW-28 allows same status update without transition error', () => {
    const batch = createBatch();

    expect(batchService.updateBatchStatus({
      id: batch.id,
      status: 'ativo',
      user
    }).status).toBe('ativo');
  });

  test('TW-29 rejects transition after batch is concluded', () => {
    const batch = createBatch();
    batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      actualEndDate: '2026-07-13',
      user
    });

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-30 rejects active to comprometido without losses', () => {
    const batch = createBatch();

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-31 allows active to comprometido after a loss is registered', () => {
    const batch = createBatch();
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

  test('TW-32 rejects conclusion without actualEndDate through public validation', () => {
    const batch = createBatch();

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test('TW-33 allows active to concluido with valid actualEndDate', () => {
    const batch = createBatch();

    expect(batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      actualEndDate: '2026-07-13',
      user
    })).toMatchObject({
      status: 'concluido',
      actualEndDate: '2026-07-13'
    });
  });

  test('TW-34 allows comprometido to concluido with valid actualEndDate', () => {
    const batch = createBatch();
    batchService.addLoss({
      id: batch.id,
      quantity: 2,
      reason: 'damaged',
      date: '2026-05-15',
      user
    });
    batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    });

    expect(batchService.updateBatchStatus({
      id: batch.id,
      status: 'concluido',
      actualEndDate: '2026-07-13',
      user
    }).status).toBe('concluido');
  });

  test('TW-35 rejects comprometido to ativo transition', () => {
    const batch = createBatch();
    batchService.addLoss({
      id: batch.id,
      quantity: 2,
      reason: 'damaged',
      date: '2026-05-15',
      user
    });
    batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    });

    expect(() => batchService.updateBatchStatus({
      id: batch.id,
      status: 'ativo',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });
});
