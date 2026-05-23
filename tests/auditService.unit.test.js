const auditRepository = require('../src/repositories/auditRepository');
const auditService = require('../src/services/auditService');

describe('auditService unit tests', () => {
  beforeEach(() => {
    auditRepository.reset();
  });

  test('TU80 records an audit entry', () => {
    const auditLog = auditService.recordAudit({
      userId: '7',
      username: 'ana_green',
      action: 'create',
      resource: 'batches',
      resourceId: '1'
    });

    expect(auditLog).toMatchObject({
      id: '1',
      userId: '7',
      username: 'ana_green',
      action: 'create',
      resource: 'batches',
      resourceId: '1'
    });
    expect(auditLog.timestamp).toEqual(expect.any(String));
  });

  test('TU81 lists audit entries', () => {
    auditService.recordAudit({
      userId: '7',
      username: 'ana_green',
      action: 'create',
      resource: 'batches',
      resourceId: '1'
    });

    expect(auditService.listAuditLogs()).toHaveLength(1);
  });
});
