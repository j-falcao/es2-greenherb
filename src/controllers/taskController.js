const taskService = require('../services/taskService');

function handleError(res, error) {
  res.status(error.statusCode || 500).json({ message: error.message });
}

function createTask(req, res) {
  try {
    res.status(201).json(taskService.createTask({ ...req.body, user: req.user }));
  } catch (error) {
    handleError(res, error);
  }
}

function listTasks(req, res) {
  res.status(200).json(taskService.listTasks());
}

function getTaskById(req, res) {
  try {
    res.status(200).json(taskService.getTaskById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

function updateTaskStatus(req, res) {
  try {
    res.status(200).json(taskService.updateTaskStatus({
      id: req.params.id,
      status: req.body.status,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTaskStatus
};
