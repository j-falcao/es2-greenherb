const auditRepository = require('../src/repositories/auditRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const planRepository = require('../src/repositories/planRepository');
const taskRepository = require('../src/repositories/taskRepository');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const planService = require('../src/services/planService');
const taskService = require('../src/services/taskService');

describe('taskService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    planRepository.reset();
    taskRepository.reset();
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
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });
  }

  test('TU58 creates a task for an existing batch', () => {
    const batch = createBatch();

    const task = taskService.createTask({
      batchId: batch.id,
      type: 'rega',
      dueDate: '2026-05-16',
      user
    });

    expect(task).toMatchObject({
      id: '1',
      batchId: '1',
      type: 'rega',
      dueDate: '2026-05-16',
      assignedTo: null,
      status: 'pendente',
      notes: null
    });
  });

  test('TU59 lists and gets tasks by id', () => {
    const batch = createBatch();
    const task = taskService.createTask({
      batchId: batch.id,
      type: 'rega',
      dueDate: '2026-05-16',
      user
    });

    expect(taskService.listTasks()).toHaveLength(1);
    expect(taskService.getTaskById(task.id)).toEqual(task);
  });

  test('TU60 updates task status', () => {
    const batch = createBatch();
    const task = taskService.createTask({
      batchId: batch.id,
      type: 'rega',
      dueDate: '2026-05-16',
      user
    });

    expect(taskService.updateTaskStatus({
      id: task.id,
      status: 'concluida',
      user
    }).status).toBe('concluida');
  });

  test('TU61 rejects task creation for unknown batch', () => {
    expect(() => taskService.createTask({
      batchId: '999',
      type: 'rega',
      dueDate: '2026-05-16',
      user
    })).toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  test('TU62 rejects invalid task type', () => {
    const batch = createBatch();

    expect(() => taskService.createTask({
      batchId: batch.id,
      type: 'poda',
      dueDate: '2026-05-16',
      user
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });
});
