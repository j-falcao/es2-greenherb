const auditRepository = require('../src/repositories/auditRepository');
const automationRepository = require('../src/repositories/automationRepository');
const automationService = require('../src/services/automationService');

describe('automationService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    automationRepository.reset();
  });

  test('TU72 creates an automation rule', () => {
    const rule = automationService.createRule({
      name: 'Critical temperature',
      trigger: 'temperature > 30',
      action: 'create alert',
      user
    });

    expect(rule).toEqual({
      id: '1',
      name: 'Critical temperature',
      trigger: 'temperature > 30',
      action: 'create alert',
      enabled: true
    });
  });

  test('TU73 lists and gets automation rules by id', () => {
    const rule = automationService.createRule({
      name: 'Critical temperature',
      trigger: 'temperature > 30',
      action: 'create alert',
      user
    });

    expect(automationService.listRules()).toHaveLength(1);
    expect(automationService.getRuleById(rule.id)).toEqual(rule);
  });

  test('TU74 updates an automation rule', () => {
    const rule = automationService.createRule({
      name: 'Critical temperature',
      trigger: 'temperature > 30',
      action: 'create alert',
      user
    });

    expect(automationService.updateRule({
      id: rule.id,
      enabled: false,
      user
    }).enabled).toBe(false);
  });

  test('TU75 gets and sets automation mode', () => {
    expect(automationService.getMode()).toEqual({ mode: 'manual' });
    expect(automationService.setMode({ mode: 'automatico', user })).toEqual({ mode: 'automatico' });
  });

  test('TU76 rejects invalid automation mode', () => {
    expect(() => automationService.setMode({
      mode: 'hybrid',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  test.each([
    ['TU118', 'automatico', true, '2026-05-14T10:00:00.000Z', 'execute'],
    ['TU119', 'manual', true, '2026-05-14T10:00:00.000Z', 'suggest'],
    ['TU120', 'automatico', false, '2026-05-14T10:00:00.000Z', 'skip'],
    ['TU121', 'automatico', true, '2026-05-14T09:20:00.000Z', 'skip']
  ])('%s decides automation action using MC/DC conditions', (
    testId,
    mode,
    enabled,
    measuredAt,
    expectedDecision
  ) => {
    const decision = automationService.decideRuleAction({
      mode,
      rule: { enabled },
      measurement: { measuredAt },
      now: new Date('2026-05-14T10:00:00.000Z')
    });

    expect(decision.decision).toBe(expectedDecision);
  });
});
