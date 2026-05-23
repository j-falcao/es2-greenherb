const auditRepository = require('../src/repositories/auditRepository');
const automationRepository = require('../src/repositories/automationRepository');
const automationService = require('../src/services/automationService');

describe('automationService white-box decision tests', () => {
  const now = new Date('2026-05-14T10:00:00.000Z');
  const recentMeasurement = { measuredAt: '2026-05-14T09:45:00.000Z' };

  beforeEach(() => {
    auditRepository.reset();
    automationRepository.reset();
  });

  function decide(overrides = {}) {
    return automationService.decideRuleAction({
      mode: 'automatico',
      rule: { enabled: true },
      measurement: recentMeasurement,
      now,
      ...overrides
    });
  }

  test('TW-36 decides execute for automatic mode, active rule, recent measurement', () => {
    expect(decide()).toMatchObject({
      decision: 'execute',
      automaticMode: true,
      ruleActive: true,
      recentMeasurement: true
    });
  });

  test('TW-37 decides suggest for manual mode, active rule, recent measurement', () => {
    expect(decide({ mode: 'manual' })).toMatchObject({
      decision: 'suggest',
      automaticMode: false,
      ruleActive: true,
      recentMeasurement: true
    });
  });

  test('TW-38 decides skip when rule is inactive', () => {
    expect(decide({ rule: { enabled: false } })).toMatchObject({
      decision: 'skip',
      ruleActive: false,
      recentMeasurement: true
    });
  });

  test('TW-39 decides skip when rule is missing', () => {
    expect(decide({ rule: null })).toMatchObject({
      decision: 'skip',
      ruleActive: false,
      recentMeasurement: true
    });
  });

  test('TW-40 decides skip when measurement is older than the recency limit', () => {
    expect(decide({
      measurement: { measuredAt: '2026-05-14T09:20:00.000Z' }
    })).toMatchObject({
      decision: 'skip',
      ruleActive: true,
      recentMeasurement: false
    });
  });

  test('TW-41 decides skip when measurement is in the future', () => {
    expect(decide({
      measurement: { measuredAt: '2026-05-14T10:01:00.000Z' }
    })).toMatchObject({
      decision: 'skip',
      recentMeasurement: false
    });
  });

  test('TW-42 decides skip when measurement is missing', () => {
    expect(decide({ measurement: null })).toMatchObject({
      decision: 'skip',
      recentMeasurement: false
    });
  });

  test('TW-43 decides skip when measurement has no measuredAt', () => {
    expect(decide({ measurement: {} })).toMatchObject({
      decision: 'skip',
      recentMeasurement: false
    });
  });

  test('TW-44 decides skip when measuredAt is invalid', () => {
    expect(decide({
      measurement: { measuredAt: 'not-a-date' }
    })).toMatchObject({
      decision: 'skip',
      recentMeasurement: false
    });
  });

  test('TW-45 uses repository default mode when mode is omitted', () => {
    automationService.setMode({
      mode: 'automatico',
      user: { id: '7', username: 'ana_green' }
    });

    expect(automationService.decideRuleAction({
      rule: { enabled: true },
      measurement: recentMeasurement,
      now
    })).toMatchObject({
      decision: 'execute',
      automaticMode: true
    });
  });
});
