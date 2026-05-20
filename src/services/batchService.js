const batchRepository = require('../repositories/batchRepository');
const planRepository = require('../repositories/planRepository');
const auditService = require('./auditService');
const { createError } = require('./errors');
const {
  requireDate,
  requireNonNegativeNumber,
  requireNumber,
  requireOneOf,
  requireString
} = require('./validators');

const BATCH_STATUSES = ['ativo', 'concluido', 'comprometido'];

function getBatchOrThrow(id) {
  const batch = batchRepository.findById(id);

  if (!batch) {
    throw createError('Batch not found', 404);
  }

  return batch;
}

function createBatch({ planId, code, startDate, status = 'ativo', expectedYield = 0, user }) {
  if (!planRepository.findById(planId)) {
    throw createError('Plan not found', 404);
  }

  const batch = batchRepository.create({
    planId: String(planId),
    code: requireString(code, 'code'),
    startDate: requireDate(startDate, 'startDate'),
    status: requireOneOf(status, BATCH_STATUSES, 'status'),
    expectedYield: requireNonNegativeNumber(expectedYield, 'expectedYield'),
    actualEndDate: null,
    divisions: [],
    losses: [],
    productivity: null
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'create',
    resource: 'batches',
    resourceId: batch.id
  });

  return batch;
}

function listBatches() {
  return batchRepository.findAll();
}

function getBatchById(id) {
  return getBatchOrThrow(id);
}

function assertBatchTransition(batch, nextStatus, actualEndDate) {
  if (batch.status === nextStatus) {
    return;
  }

  if (batch.status === 'concluido') {
    throw createError('Concluded batches cannot change status', 400);
  }

  if (nextStatus === 'comprometido' && batch.losses.length === 0) {
    throw createError('Batch can only be compromised after losses are registered', 400);
  }

  if (nextStatus === 'concluido' && !actualEndDate) {
    throw createError('actualEndDate is required to conclude a batch', 400);
  }

  const allowedTransitions = {
    ativo: ['concluido', 'comprometido'],
    comprometido: ['concluido']
  };

  if (!allowedTransitions[batch.status] || !allowedTransitions[batch.status].includes(nextStatus)) {
    throw createError(`Cannot transition batch from ${batch.status} to ${nextStatus}`, 400);
  }
}

function updateBatchStatus({ id, status, actualEndDate, user }) {
  const batch = getBatchOrThrow(id);
  const nextStatus = requireOneOf(status, BATCH_STATUSES, 'status');
  const normalizedActualEndDate = nextStatus === 'concluido'
    ? requireDate(actualEndDate, 'actualEndDate')
    : null;

  assertBatchTransition(batch, nextStatus, normalizedActualEndDate);

  batchRepository.update(id, {
    status: nextStatus,
    actualEndDate: normalizedActualEndDate || batch.actualEndDate
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'update_status',
    resource: 'batches',
    resourceId: batch.id
  });

  return batch;
}

function addDivision({ id, name, area, user }) {
  const batch = getBatchOrThrow(id);
  const division = {
    id: String(batch.divisions.length + 1),
    name: requireString(name, 'name'),
    area: requireNonNegativeNumber(area, 'area')
  };

  batch.divisions.push(division);

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'add_division',
    resource: 'batches',
    resourceId: batch.id
  });

  return batch;
}

function addLoss({ id, quantity, reason, date, user }) {
  const batch = getBatchOrThrow(id);
  const loss = {
    id: String(batch.losses.length + 1),
    quantity: requireNonNegativeNumber(quantity, 'quantity'),
    reason: requireString(reason, 'reason'),
    date: requireDate(date, 'date')
  };

  batch.losses.push(loss);

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'add_loss',
    resource: 'batches',
    resourceId: batch.id
  });

  return batch;
}

function calculateProductivity({ expectedYield, harvestedQuantity, losses, plannedDurationDays, actualDurationDays }) {
  const expected = requireNumber(expectedYield, 'expectedYield');
  const harvested = requireNonNegativeNumber(harvestedQuantity, 'harvestedQuantity');
  const plannedDays = requireNumber(plannedDurationDays, 'plannedDurationDays');
  const actualDays = requireNumber(actualDurationDays, 'actualDurationDays');

  if (expected <= 0) {
    throw createError('expectedYield must be greater than zero', 400);
  }

  if (plannedDays <= 0 || actualDays <= 0) {
    throw createError('plannedDurationDays and actualDurationDays must be greater than zero', 400);
  }

  const totalLosses = losses.reduce((sum, loss) => sum + loss.quantity, 0);
  const yieldRatio = Math.max((harvested - totalLosses) / expected, 0);
  const timeRatio = plannedDays / actualDays;

  return Number((yieldRatio * timeRatio * 100).toFixed(2));
}

function updateProductivity({
  id,
  productivity,
  harvestedQuantity,
  plannedDurationDays,
  actualDurationDays,
  user
}) {
  const batch = getBatchOrThrow(id);
  const nextProductivity = productivity === undefined
    ? calculateProductivity({
      expectedYield: batch.expectedYield,
      harvestedQuantity,
      losses: batch.losses,
      plannedDurationDays,
      actualDurationDays
    })
    : requireNonNegativeNumber(productivity, 'productivity');

  batchRepository.update(id, {
    productivity: nextProductivity
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'update_productivity',
    resource: 'batches',
    resourceId: batch.id
  });

  return batch;
}

module.exports = {
  BATCH_STATUSES,
  calculateProductivity,
  createBatch,
  listBatches,
  getBatchById,
  updateBatchStatus,
  addDivision,
  addLoss,
  updateProductivity
};
