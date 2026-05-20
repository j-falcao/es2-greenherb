const express = require('express');
const automationController = require('../controllers/automationController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/rules', automationController.createRule);
router.get('/rules', automationController.listRules);
router.get('/rules/:id', automationController.getRuleById);
router.patch('/rules/:id', automationController.updateRule);
router.get('/mode', automationController.getMode);
router.put('/mode', automationController.setMode);

module.exports = router;
