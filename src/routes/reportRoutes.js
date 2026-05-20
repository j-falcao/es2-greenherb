const express = require('express');
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, reportController.exportReport);

module.exports = router;
