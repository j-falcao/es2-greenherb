const alertService = require('../services/alertService');

function handleError(res, error) {
  res.status(error.statusCode || 500).json({ message: error.message });
}

function createAlert(req, res) {
  try {
    res.status(201).json(alertService.createAlert({ ...req.body, user: req.user }));
  } catch (error) {
    handleError(res, error);
  }
}

function listAlerts(req, res) {
  res.status(200).json(alertService.listAlerts());
}

function getAlertById(req, res) {
  try {
    res.status(200).json(alertService.getAlertById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

function resolveAlert(req, res) {
  try {
    res.status(200).json(alertService.resolveAlert({
      id: req.params.id,
      resolution: req.body.resolution,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

function ignoreAlert(req, res) {
  try {
    res.status(200).json(alertService.ignoreAlert({
      id: req.params.id,
      justification: req.body.justification,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  createAlert,
  listAlerts,
  getAlertById,
  resolveAlert,
  ignoreAlert
};
