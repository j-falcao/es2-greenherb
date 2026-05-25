const alertRepository = require('../repositories/alertRepository');
const notificationGateway = require('../gateways/notificationGateway');
const auditService = require('./auditService');
const { createError } = require('./errors');
const { requireOneOf, requireString, requireStringLength } = require('./validators');

const ALERT_TYPES = ['informativo', 'aviso', 'critico'];
const ALERT_STATUSES = ['ativo', 'resolvido', 'ignorado'];
const IGNORE_JUSTIFICATION_RANGE = { min: 10, max: 500 };

function getAlertOrThrow(id) {
  const alert = alertRepository.findById(id);

  if (!alert) {
    throw createError('Alert not found', 404);
  }

  return alert;
}

function createAlert({ type, message, resource, resourceId, user }) {
  const alert = alertRepository.create({
    type: requireOneOf(type, ALERT_TYPES, 'type'),
    message: requireString(message, 'message'),
    resource: resource || null,
    resourceId: resourceId ? String(resourceId) : null,
    status: 'ativo',
    resolution: null,
    ignoredJustification: null,
    createdAt: new Date().toISOString()
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'create',
    resource: 'alerts',
    resourceId: alert.id
  });

  return alert;
}

function countMeasurementViolations(measurement, environmentLimits) {
  const violations = [];

  if (measurement.temperature < environmentLimits.temperature.min) {
    violations.push('temperature_below_min');
  }

  if (measurement.temperature > environmentLimits.temperature.max) {
    violations.push('temperature_above_max');
  }

  if (measurement.humidity < environmentLimits.humidity.min) {
    violations.push('humidity_below_min');
  }

  if (measurement.humidity > environmentLimits.humidity.max) {
    violations.push('humidity_above_max');
  }

  if (measurement.luminosity < environmentLimits.luminosity.min) {
    violations.push('luminosity_below_min');
  }

  if (measurement.luminosity > environmentLimits.luminosity.max) {
    violations.push('luminosity_above_max');
  }

  return violations;
}

function classifyMeasurementAlert({ measurement, environmentLimits, sensorOK = true }) {
  if (!sensorOK) {
    return {
      type: 'informativo',
      violations: ['sensor_unreliable']
    };
  }

  const violations = countMeasurementViolations(measurement, environmentLimits);

  if (violations.length === 0) {
    return {
      type: 'informativo',
      violations
    };
  }

  return {
    type: violations.length === 1 ? 'aviso' : 'critico',
    violations
  };
}

function createMeasurementAlert({ measurement, batch, plan, sensorOK = true, user }) {
  const classification = classifyMeasurementAlert({
    measurement,
    environmentLimits: plan.environmentLimits,
    sensorOK
  });

  if (classification.violations.length === 0) {
    return null;
  }

  const alert = createAlert({
    type: classification.type,
    message: `Measurement ${measurement.id} outside cultivation plan limits: ${classification.violations.join(', ')}`,
    resource: 'measurements',
    resourceId: measurement.id,
    user
  });

  notificationGateway.sendNotification({
    type: alert.type,
    message: alert.message,
    resource: alert.resource,
    resourceId: alert.resourceId
  });

  return alert;
}

function listAlerts() {
  return alertRepository.findAll();
}

function getAlertById(id) {
  return getAlertOrThrow(id);
}

function resolveAlert({ id, resolution, user }) {
  const alert = getAlertOrThrow(id);
  alertRepository.update(id, {
    status: 'resolvido',
    resolution: resolution || null,
    resolvedAt: new Date().toISOString()
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'resolve',
    resource: 'alerts',
    resourceId: alert.id
  });

  return alert;
}

function ignoreAlert({ id, justification, user }) {
  const alert = getAlertOrThrow(id);
  alertRepository.update(id, {
    status: 'ignorado',
    ignoredJustification: requireStringLength(
      justification,
      'justification',
      IGNORE_JUSTIFICATION_RANGE.min,
      IGNORE_JUSTIFICATION_RANGE.max
    ),
    ignoredAt: new Date().toISOString()
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'ignore',
    resource: 'alerts',
    resourceId: alert.id
  });

  return alert;
}

module.exports = {
  ALERT_TYPES,
  ALERT_STATUSES,
  IGNORE_JUSTIFICATION_RANGE,
  classifyMeasurementAlert,
  createMeasurementAlert,
  createAlert,
  listAlerts,
  getAlertById,
  resolveAlert,
  ignoreAlert
};
