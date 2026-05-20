const express = require('express');
const auditController = require('../controllers/auditController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, auditController.listAuditLogs);

module.exports = router;
