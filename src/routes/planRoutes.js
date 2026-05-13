const express = require('express');
const planController = require('../controllers/planController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, planController.createPlan);

module.exports = router;
