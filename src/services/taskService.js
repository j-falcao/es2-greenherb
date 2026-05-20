const taskRepository = require('../repositories/taskRepository');
const batchRepository = require('../repositories/batchRepository');
const auditService = require('./auditService');
const { createError } = require('./errors');
const { requireDate, requireOneOf, requireString } = require('./validators');

const TASK_TYPES = ['rega', 'fertilizacao', 'colheita', 'monitorizacao'];
const TASK_STATUSES = ['pendente', 'em_progresso', 'concluida', 'cancelada'];

function getTaskOrThrow(id) {
  const task = taskRepository.findById(id);

  if (!task) {
    throw createError('Task not found', 404);
  }

  return task;
}

function createTask({ batchId, type, dueDate, assignedTo, status = 'pendente', notes, user }) {
  if (!batchRepository.findById(batchId)) {
    throw createError('Batch not found', 404);
  }

  const task = taskRepository.create({
    batchId: String(batchId),
    type: requireOneOf(type, TASK_TYPES, 'type'),
    dueDate: requireDate(dueDate, 'dueDate'),
    assignedTo: assignedTo ? String(assignedTo) : null,
    status: requireOneOf(status, TASK_STATUSES, 'status'),
    notes: notes || null
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'create',
    resource: 'tasks',
    resourceId: task.id
  });

  return task;
}

function listTasks() {
  return taskRepository.findAll();
}

function getTaskById(id) {
  return getTaskOrThrow(id);
}

function updateTaskStatus({ id, status, user }) {
  const task = getTaskOrThrow(id);
  taskRepository.update(id, {
    status: requireOneOf(status, TASK_STATUSES, 'status')
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'update_status',
    resource: 'tasks',
    resourceId: task.id
  });

  return task;
}

module.exports = {
  TASK_TYPES,
  TASK_STATUSES,
  createTask,
  listTasks,
  getTaskById,
  updateTaskStatus
};
