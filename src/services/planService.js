const planRepository = require('../repositories/planRepository');
const herbService = require('./herbService');

const PLAN_TYPES = ['regular', 'emergencia', 'pontual'];

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

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

function createPlan({ userId, herbId, startDate, type = 'regular', notes }) {
  const herb = herbService.getHerbById(herbId);

  if (!herb) {
    throw createError('Herb not found', 404);
  }

  if (!isValidDateString(startDate)) {
    throw createError('Valid startDate is required', 400);
  }

  validatePlanType(type);

  return planRepository.create({
    userId: String(userId),
    herbId: String(herbId),
    type,
    startDate,
    notes: notes || null,
    expectedHarvestDate: addDays(startDate, herb.harvestDays)
  });
}

module.exports = {
  createPlan,
  PLAN_TYPES
};
