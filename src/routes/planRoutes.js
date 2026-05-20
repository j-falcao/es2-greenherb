const express = require('express');
const planController = require('../controllers/planController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, planController.createPlan);
router.get('/', authenticate, planController.listPlans);
router.get('/:id', authenticate, planController.getPlanById);

module.exports = router;
