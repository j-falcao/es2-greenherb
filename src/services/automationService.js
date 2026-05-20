const automationRepository = require('../repositories/automationRepository');
const auditService = require('./auditService');
const { createError } = require('./errors');
const { requireOneOf, requireString } = require('./validators');

const AUTOMATION_MODES = ['manual', 'automatico'];
const DEFAULT_RECENT_MEASUREMENT_MINUTES = 30;

function getRuleOrThrow(id) {
  const rule = automationRepository.findRuleById(id);

  if (!rule) {
    throw createError('Automation rule not found', 404);
  }

  return rule;
}

function createRule({ name, trigger, action, enabled = true, user }) {
  const rule = automationRepository.createRule({
    name: requireString(name, 'name'),
    trigger: requireString(trigger, 'trigger'),
    action: requireString(action, 'action'),
    enabled: Boolean(enabled)
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'create',
    resource: 'automation.rules',
    resourceId: rule.id
  });

  return rule;
}

function listRules() {
  return automationRepository.findAllRules();
}

function getRuleById(id) {
  return getRuleOrThrow(id);
}

function updateRule({ id, name, trigger, action, enabled, user }) {
  const rule = getRuleOrThrow(id);
  const changes = {};

  if (name !== undefined) {
    changes.name = requireString(name, 'name');
  }

  if (trigger !== undefined) {
    changes.trigger = requireString(trigger, 'trigger');
  }

  if (action !== undefined) {
    changes.action = requireString(action, 'action');
  }

  if (enabled !== undefined) {
    changes.enabled = Boolean(enabled);
  }

  automationRepository.updateRule(id, changes);

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'update',
    resource: 'automation.rules',
    resourceId: rule.id
  });

  return rule;
}

function getMode() {
  return automationRepository.getMode();
}

function setMode({ mode, user }) {
  const result = automationRepository.setMode(requireOneOf(mode, AUTOMATION_MODES, 'mode'));

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'set_mode',
    resource: 'automation.mode',
    resourceId: null
  });

  return result;
}

function isRecentMeasurement(measurement, now = new Date(), maxAgeMinutes = DEFAULT_RECENT_MEASUREMENT_MINUTES) {
  if (!measurement || !measurement.measuredAt) {
    return false;
  }

  const measuredAt = new Date(measurement.measuredAt);

  if (Number.isNaN(measuredAt.getTime())) {
    return false;
  }

  const ageMilliseconds = now.getTime() - measuredAt.getTime();

  return ageMilliseconds >= 0 && ageMilliseconds <= maxAgeMinutes * 60 * 1000;
}

function decideRuleAction({
  mode = getMode().mode,
  rule,
  measurement,
  now = new Date(),
  maxAgeMinutes = DEFAULT_RECENT_MEASUREMENT_MINUTES
}) {
  const normalizedMode = requireOneOf(mode, AUTOMATION_MODES, 'mode');
  const automaticMode = normalizedMode === 'automatico';
  const ruleActive = Boolean(rule && rule.enabled);
  const recentMeasurement = isRecentMeasurement(measurement, now, maxAgeMinutes);

  if (!ruleActive || !recentMeasurement) {
    return {
      decision: 'skip',
      automaticMode,
      ruleActive,
      recentMeasurement
    };
  }

  return {
    decision: automaticMode ? 'execute' : 'suggest',
    automaticMode,
    ruleActive,
    recentMeasurement
  };
}

module.exports = {
  AUTOMATION_MODES,
  DEFAULT_RECENT_MEASUREMENT_MINUTES,
  createRule,
  listRules,
  getRuleById,
  updateRule,
  getMode,
  setMode,
  isRecentMeasurement,
  decideRuleAction
};
