const automationService = require('../services/automationService');

function handleError(res, error) {
  res.status(error.statusCode || 500).json({ message: error.message });
}

function createRule(req, res) {
  try {
    res.status(201).json(automationService.createRule({ ...req.body, user: req.user }));
  } catch (error) {
    handleError(res, error);
  }
}

function listRules(req, res) {
  res.status(200).json(automationService.listRules());
}

function getRuleById(req, res) {
  try {
    res.status(200).json(automationService.getRuleById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

function updateRule(req, res) {
  try {
    res.status(200).json(automationService.updateRule({
      id: req.params.id,
      ...req.body,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

function getMode(req, res) {
  res.status(200).json(automationService.getMode());
}

function setMode(req, res) {
  try {
    res.status(200).json(automationService.setMode({
      mode: req.body.mode,
      user: req.user
    }));
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  createRule,
  listRules,
  getRuleById,
  updateRule,
  getMode,
  setMode
};
