const auditRepository = require('../src/repositories/auditRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const planRepository = require('../src/repositories/planRepository');
const batchService = require('../src/services/batchService');
const herbService = require('../src/services/herbService');
const planService = require('../src/services/planService');
const reportService = require('../src/services/reportService');

describe('reportService unit tests', () => {
  const user = { id: '7', username: 'ana_green' };

  beforeEach(() => {
    auditRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    planRepository.reset();
  });

  function createBatch() {
    const herb = herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nBasil,2,60',
      user
    )[0];
    const plan = planService.createPlan({
      userId: user.id,
      herbId: herb.id,
      startDate: '2026-05-13',
      user
    });

    return batchService.createBatch({
      planId: plan.id,
      code: 'BATCH-001',
      startDate: '2026-05-14',
      user
    });
  }

  test('TU77 exports a CSV report', () => {
    createBatch();

    const report = reportService.exportReport({
      resource: 'plans',
      format: 'csv'
    });

    expect(report).toMatchObject({
      filename: 'plans.csv',
      contentType: 'text/csv'
    });
    expect(report.body).toContain('id,userId,herbId,type,startDate,notes,cycleDurationDays,expectedHarvestDate,environmentLimits,pontualAuthorization');
  });

  test('TU79 rejects unknown report resources', () => {
    expect(() => reportService.exportReport({
      resource: 'unknown',
      format: 'csv'
    })).toThrow(expect.objectContaining({ statusCode: 400 }));
  });
});
