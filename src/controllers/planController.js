const planService = require('../services/planService');

function createPlan(req, res) {
  try {
    const plan = planService.createPlan({
      userId: req.user.id,
      herbId: req.body.herbId,
      type: req.body.type,
      startDate: req.body.startDate,
      notes: req.body.notes
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

module.exports = {
  createPlan
};
