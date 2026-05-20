const batchService = require('../services/batchService');

function handleError(res, error) {
  res.status(error.statusCode || 500).json({ message: error.message });
}

function createBatch(req, res) {
  try {
    const batch = batchService.createBatch({ ...req.body, user: req.user });
    res.status(201).json(batch);
  } catch (error) {
    handleError(res, error);
  }
}

function listBatches(req, res) {
  res.status(200).json(batchService.listBatches());
}

function getBatchById(req, res) {
  try {
    res.status(200).json(batchService.getBatchById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

function updateBatchStatus(req, res) {
  try {
    res.status(200).json(batchService.updateBatchStatus({
      id: req.params.id,
      status: req.body.status,
      actualEndDate: req.body.actualEndDate,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

function addDivision(req, res) {
  try {
    res.status(200).json(batchService.addDivision({
      id: req.params.id,
      name: req.body.name,
      area: req.body.area,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

function addLoss(req, res) {
  try {
    res.status(200).json(batchService.addLoss({
      id: req.params.id,
      quantity: req.body.quantity,
      reason: req.body.reason,
      date: req.body.date,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

function updateProductivity(req, res) {
  try {
    res.status(200).json(batchService.updateProductivity({
      id: req.params.id,
      productivity: req.body.productivity,
      harvestedQuantity: req.body.harvestedQuantity,
      plannedDurationDays: req.body.plannedDurationDays,
      actualDurationDays: req.body.actualDurationDays,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  createBatch,
  listBatches,
  getBatchById,
  updateBatchStatus,
  addDivision,
  addLoss,
  updateProductivity
};
