const express = require('express');
const measurementController = require('../controllers/measurementController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', measurementController.createMeasurement);
router.get('/', measurementController.listMeasurements);
router.get('/:id', measurementController.getMeasurementById);

module.exports = router;
