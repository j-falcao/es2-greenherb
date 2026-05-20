const planService = require('../services/planService');

function createPlan(req, res) {
  try {
    const plan = planService.createPlan({
      userId: req.user.id,
      herbId: req.body.herbId,
      type: req.body.type,
      startDate: req.body.startDate,
      notes: req.body.notes,
      environmentLimits: req.body.environmentLimits,
      cycleDurationDays: req.body.cycleDurationDays,
      technicalResponsibleAuthorization: req.body.technicalResponsibleAuthorization,
      user: req.user
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

function listPlans(req, res) {
  res.status(200).json(planService.listPlans());
}

function getPlanById(req, res) {
  try {
    res.status(200).json(planService.getPlanById(req.params.id));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

module.exports = {
  createPlan,
  listPlans,
  getPlanById
};
