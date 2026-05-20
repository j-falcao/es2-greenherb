const auditRepository = require('../repositories/auditRepository');

function recordAudit({ userId, username, action, resource, resourceId }) {
  return auditRepository.create({
    userId: userId ? String(userId) : null,
    username: username || null,
    action,
    resource,
    resourceId: resourceId ? String(resourceId) : null,
    timestamp: new Date().toISOString()
  });
}

function listAuditLogs() {
  return auditRepository.findAll();
}

module.exports = {
  recordAudit,
  listAuditLogs
};
