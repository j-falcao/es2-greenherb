const auditService = require('./auditService');
const alertService = require('./alertService');
const automationService = require('./automationService');
const batchService = require('./batchService');
const herbService = require('./herbService');
const measurementService = require('./measurementService');
const planService = require('./planService');
const taskService = require('./taskService');
const userService = require('./userService');
const { createError } = require('./errors');

const RESOURCE_READERS = {
  users: userService.listUsers,
  herbs: herbService.listHerbs,
  plans: planService.listPlans,
  batches: batchService.listBatches,
  tasks: taskService.listTasks,
  measurements: measurementService.listMeasurements,
  alerts: alertService.listAlerts,
  audit: auditService.listAuditLogs,
  automationRules: automationService.listRules
};

function flattenValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function escapeCsv(value) {
  const text = flattenValue(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function toCsv(rows) {
  if (rows.length === 0) {
    return '';
  }

  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))
  ];

  return lines.join('\n');
}

function exportReport({ resource, format = 'csv' }) {
  if (format === 'excel') {
    throw createError('Excel reports are not implemented', 501);
  }

  if (format !== 'csv') {
    throw createError('format must be csv or excel', 400);
  }

  const reader = RESOURCE_READERS[resource];

  if (!reader) {
    throw createError('Unknown report resource', 400);
  }

  return {
    filename: `${resource}.csv`,
    contentType: 'text/csv',
    body: toCsv(reader())
  };
}

module.exports = {
  exportReport,
  toCsv
};
