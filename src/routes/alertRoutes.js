const express = require('express');
const alertController = require('../controllers/alertController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', alertController.createAlert);
router.get('/', alertController.listAlerts);
router.get('/:id', alertController.getAlertById);
router.patch('/:id/resolve', alertController.resolveAlert);
router.patch('/:id/ignore', alertController.ignoreAlert);

module.exports = router;
