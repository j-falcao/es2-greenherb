const { createError } = require('./errors');

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function requireString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw createError(`${fieldName} is required`, 400);
  }

  return value.trim();
}

function requireDate(value, fieldName) {
  if (!isValidDateString(value)) {
    throw createError(`Valid ${fieldName} is required`, 400);
  }

  return value;
}

function requireNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw createError(`${fieldName} must be a number`, 400);
  }

  return number;
}

function requireNumberInRange(value, fieldName, min, max) {
  const number = requireNumber(value, fieldName);

  if (number < min || number > max) {
    throw createError(`${fieldName} must be between ${min} and ${max}`, 400);
  }

  return number;
}

function requireIntegerInRange(value, fieldName, min, max) {
  const number = requireNumberInRange(value, fieldName, min, max);

  if (!Number.isInteger(number)) {
    throw createError(`${fieldName} must be an integer`, 400);
  }

  return number;
}

function requireNonNegativeNumber(value, fieldName) {
  const number = requireNumber(value, fieldName);

  if (number < 0) {
    throw createError(`${fieldName} must be zero or greater`, 400);
  }

  return number;
}

function requireOneOf(value, allowedValues, fieldName) {
  if (!allowedValues.includes(value)) {
    throw createError(`${fieldName} must be ${allowedValues.join(', ')}`, 400);
  }

  return value;
}

function requireStringLength(value, fieldName, min, max) {
  const text = requireString(value, fieldName);

  if (text.length < min || text.length > max) {
    throw createError(`${fieldName} length must be between ${min} and ${max}`, 400);
  }

  return text;
}

module.exports = {
  isValidDateString,
  requireString,
  requireDate,
  requireNumber,
  requireNumberInRange,
  requireIntegerInRange,
  requireNonNegativeNumber,
  requireOneOf,
  requireStringLength
};
