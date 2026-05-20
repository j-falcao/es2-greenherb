const planRepository = require('../repositories/planRepository');
const herbService = require('./herbService');
const auditService = require('./auditService');
const { createError } = require('./errors');
const { requireIntegerInRange, requireNumberInRange } = require('./validators');

const PLAN_TYPES = ['regular', 'emergencia', 'pontual'];
const LIMIT_RANGES = {
  temperature: { min: 18, max: 28 },
  humidity: { min: 40, max: 80 },
  luminosity: { min: 5000, max: 25000 },
  cycleDurationDays: { min: 1, max: 365 }
};

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function validatePlanType(type) {
  if (!PLAN_TYPES.includes(type)) {
    throw createError('Plan type must be regular, emergencia, or pontual', 400);
  }
}

function validateInterval(name, interval) {
  const range = LIMIT_RANGES[name];
  const min = requireNumberInRange(interval.min, `${name}.min`, range.min, range.max);
  const max = requireNumberInRange(interval.max, `${name}.max`, range.min, range.max);

  if (min > max) {
    throw createError(`${name}.min must be less than or equal to ${name}.max`, 400);
  }

  return { min, max };
}

function normalizeEnvironmentLimits(environmentLimits = {}) {
  return {
    temperature: validateInterval('temperature', {
      ...LIMIT_RANGES.temperature,
      ...environmentLimits.temperature
    }),
    humidity: validateInterval('humidity', {
      ...LIMIT_RANGES.humidity,
      ...environmentLimits.humidity
    }),
    luminosity: validateInterval('luminosity', {
      ...LIMIT_RANGES.luminosity,
      ...environmentLimits.luminosity
    })
  };
}

function validatePontualAuthorization({ type, technicalResponsibleAuthorization, user }) {
  if (type !== 'pontual') {
    return null;
  }

  if (technicalResponsibleAuthorization !== true) {
    throw createError('Pontual plans require explicit authorization from Responsavel Tecnico', 403);
  }

  return {
    authorizedBy: user.id ? String(user.id) : null,
    authorizedAt: new Date().toISOString()
  };
}

function getPlanOrThrow(id) {
  const plan = planRepository.findById(id);

  if (!plan) {
    throw createError('Plan not found', 404);
  }

  return plan;
}

function createPlan({
  userId,
  herbId,
  startDate,
  type = 'regular',
  notes,
  environmentLimits,
  cycleDurationDays,
  technicalResponsibleAuthorization,
  user
}) {
  const herb = herbService.getHerbById(herbId);

  if (!herb) {
    throw createError('Herb not found', 404);
  }

  if (!isValidDateString(startDate)) {
    throw createError('Valid startDate is required', 400);
  }

  validatePlanType(type);
  const normalizedCycleDurationDays = requireIntegerInRange(
    cycleDurationDays === undefined ? herb.harvestDays : cycleDurationDays,
    'cycleDurationDays',
    LIMIT_RANGES.cycleDurationDays.min,
    LIMIT_RANGES.cycleDurationDays.max
  );
  const normalizedEnvironmentLimits = normalizeEnvironmentLimits(environmentLimits);
  const pontualAuthorization = validatePontualAuthorization({
    type,
    technicalResponsibleAuthorization,
    user
  });

  const plan = planRepository.create({
    userId: String(userId),
    herbId: String(herbId),
    type,
    startDate,
    notes: notes || null,
    cycleDurationDays: normalizedCycleDurationDays,
    expectedHarvestDate: addDays(startDate, normalizedCycleDurationDays),
    environmentLimits: normalizedEnvironmentLimits,
    pontualAuthorization
  });

  auditService.recordAudit({
    userId: user && user.id ? user.id : userId,
    username: user && user.username,
    action: 'create',
    resource: 'plans',
    resourceId: plan.id
  });

  return plan;
}

function listPlans() {
  return planRepository.findAll();
}

function getPlanById(id) {
  return getPlanOrThrow(id);
}

module.exports = {
  createPlan,
  listPlans,
  getPlanById,
  PLAN_TYPES,
  LIMIT_RANGES
};
