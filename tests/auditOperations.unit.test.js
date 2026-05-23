const alertRepository = require('../src/repositories/alertRepository');
const auditRepository = require('../src/repositories/auditRepository');
const automationRepository = require('../src/repositories/automationRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const measurementRepository = require('../src/repositories/measurementRepository');
const planRepository = require('../src/repositories/planRepository');
const taskRepository = require('../src/repositories/taskRepository');
const userRepository = require('../src/repositories/userRepository');

const alertService = require('../src/services/alertService');
const automationService = require('../src/services/automationService');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const measurementService = require('../src/services/measurementService');
const planService = require('../src/services/planService');
const taskService = require('../src/services/taskService');
const userService = require('../src/services/userService');

describe('audit operations unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    alertRepository.reset();
    auditRepository.reset();
    automationRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    measurementRepository.reset();
    planRepository.reset();
    taskRepository.reset();
    userRepository.reset();
  });

  function expectLatestAudit({ user: auditUser = user, action, resource, resourceId }) {
    const auditLogs = auditRepository.findAll();
    expect(auditLogs.length).toBeGreaterThan(0);

    const latestAudit = auditLogs[auditLogs.length - 1];
    expect(latestAudit).toMatchObject({
      userId: auditUser && auditUser.id ? String(auditUser.id) : null,
      username: auditUser && auditUser.username ? auditUser.username : null,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null
    });
    expect(latestAudit.timestamp).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(latestAudit.timestamp))).toBe(false);
  }

  function createHerb() {
    return herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60',
      user
    )[0];
  }

  function createPlan(herb) {
    return planService.createPlan({
      userId: user.id,
      herbId: herb.id,
      type: 'regular',
      startDate: '2026-05-13',
      user
    });
  }

  function createBatch(plan) {
    return batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      expectedYield: 25,
      user
    });
  }

  function createCultivationFlow() {
    const herb = createHerb();
    const plan = createPlan(herb);
    const batch = createBatch(plan);

    return { herb, plan, batch };
  }

  test('TU130 records user, action, and timestamp for relevant operations', async () => {
    const createdUser = await userService.createUser({
      username: 'rita_resp',
      password: 'Password123',
      role: 'Responsavel'
    });
    expectLatestAudit({
      user: createdUser,
      action: 'create',
      resource: 'users',
      resourceId: createdUser.id
    });

    const herb = createHerb();
    expectLatestAudit({
      action: 'create',
      resource: 'herbs',
      resourceId: herb.id
    });

    const plan = createPlan(herb);
    expectLatestAudit({
      action: 'create',
      resource: 'plans',
      resourceId: plan.id
    });

    const batch = createBatch(plan);
    expectLatestAudit({
      action: 'create',
      resource: 'batches',
      resourceId: batch.id
    });

    batchService.addDivision({
      id: batch.id,
      name: 'North bed',
      area: 12,
      user
    });
    expectLatestAudit({
      action: 'add_division',
      resource: 'batches',
      resourceId: batch.id
    });

    batchService.addLoss({
      id: batch.id,
      quantity: 2,
      reason: 'damaged plants',
      date: '2026-05-20',
      user
    });
    expectLatestAudit({
      action: 'add_loss',
      resource: 'batches',
      resourceId: batch.id
    });

    batchService.updateBatchStatus({
      id: batch.id,
      status: 'comprometido',
      user
    });
    expectLatestAudit({
      action: 'update_status',
      resource: 'batches',
      resourceId: batch.id
    });

    batchService.updateProductivity({
      id: batch.id,
      harvestedQuantity: 20,
      plannedDurationDays: 60,
      actualDurationDays: 62,
      user
    });
    expectLatestAudit({
      action: 'update_productivity',
      resource: 'batches',
      resourceId: batch.id
    });

    const measurement = measurementService.createMeasurement({
      batchId: batch.id,
      temperature: 29,
      humidity: 70,
      luminosity: 15000,
      measuredAt: '2026-05-14T10:00:00.000Z',
      user
    });
    expectLatestAudit({
      action: 'create',
      resource: 'measurements',
      resourceId: measurement.id
    });

    const alert = alertService.createAlert({
      type: 'aviso',
      message: 'Low humidity',
      user
    });
    expectLatestAudit({
      action: 'create',
      resource: 'alerts',
      resourceId: alert.id
    });

    alertService.resolveAlert({
      id: alert.id,
      resolution: 'Irrigation adjusted',
      user
    });
    expectLatestAudit({
      action: 'resolve',
      resource: 'alerts',
      resourceId: alert.id
    });

    const ignoredAlert = alertService.createAlert({
      type: 'informativo',
      message: 'Sensor recalibration notice',
      user
    });
    alertService.ignoreAlert({
      id: ignoredAlert.id,
      justification: 'Duplicated alert after sensor calibration',
      user
    });
    expectLatestAudit({
      action: 'ignore',
      resource: 'alerts',
      resourceId: ignoredAlert.id
    });

    const task = taskService.createTask({
      batchId: batch.id,
      type: 'rega',
      dueDate: '2026-05-15',
      assignedTo: user.id,
      user
    });
    expectLatestAudit({
      action: 'create',
      resource: 'tasks',
      resourceId: task.id
    });

    taskService.updateTaskStatus({
      id: task.id,
      status: 'concluida',
      user
    });
    expectLatestAudit({
      action: 'update_status',
      resource: 'tasks',
      resourceId: task.id
    });

    const rule = automationService.createRule({
      name: 'High temperature ventilation',
      trigger: 'temperature_above_max',
      action: 'open_ventilation',
      user
    });
    expectLatestAudit({
      action: 'create',
      resource: 'automation.rules',
      resourceId: rule.id
    });

    automationService.updateRule({
      id: rule.id,
      enabled: false,
      user
    });
    expectLatestAudit({
      action: 'update',
      resource: 'automation.rules',
      resourceId: rule.id
    });

    automationService.setMode({
      mode: 'automatico',
      user
    });
    expectLatestAudit({
      action: 'set_mode',
      resource: 'automation.mode',
      resourceId: null
    });
  });
});
