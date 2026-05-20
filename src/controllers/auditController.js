const auditService = require('../services/auditService');

function listAuditLogs(req, res) {
  res.status(200).json(auditService.listAuditLogs());
}

module.exports = {
  listAuditLogs
};
