const measurementRepository = require('../repositories/measurementRepository');
const batchRepository = require('../repositories/batchRepository');
const planRepository = require('../repositories/planRepository');
const sensorGateway = require('../gateways/sensorGateway');
const auditService = require('./auditService');
const alertService = require('./alertService');
const { createError } = require('./errors');
const { requireNumber } = require('./validators');

function getMeasurementOrThrow(id) {
  const measurement = measurementRepository.findById(id);

  if (!measurement) {
    throw createError('Measurement not found', 404);
  }

  return measurement;
}

function createMeasurement({ batchId, temperature, humidity, luminosity, measuredAt, sensorOK = true, user }) {
  const batch = batchRepository.findById(batchId);

  if (!batch) {
    throw createError('Batch not found', 404);
  }

  const plan = planRepository.findById(batch.planId);

  if (!plan) {
    throw createError('Plan not found', 404);
  }

  const date = measuredAt ? new Date(measuredAt) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw createError('Valid measuredAt is required', 400);
  }

  const measurement = measurementRepository.create({
    batchId: String(batchId),
    temperature: requireNumber(temperature, 'temperature'),
    humidity: requireNumber(humidity, 'humidity'),
    luminosity: requireNumber(luminosity, 'luminosity'),
    sensorOK: Boolean(sensorOK),
    measuredAt: date.toISOString()
  });

  const alert = alertService.createMeasurementAlert({
    measurement,
    batch,
    plan,
    sensorOK: measurement.sensorOK,
    user
  });

  auditService.recordAudit({
    userId: user && user.id,
    username: user && user.username,
    action: 'create',
    resource: 'measurements',
    resourceId: measurement.id
  });

  return {
    ...measurement,
    generatedAlert: alert
  };
}

function createMeasurementFromGateway({ batchId, measuredAt, gateway = sensorGateway, user }) {
  const reading = gateway.readEnvironment();

  return createMeasurement({
    batchId,
    temperature: reading.temperature,
    humidity: reading.humidity,
    luminosity: reading.luminosity,
    sensorOK: reading.sensorOK,
    measuredAt: reading.measuredAt || measuredAt,
    user
  });
}

function listMeasurements() {
  return measurementRepository.findAll();
}

function getMeasurementById(id) {
  return getMeasurementOrThrow(id);
}

module.exports = {
  createMeasurement,
  createMeasurementFromGateway,
  listMeasurements,
  getMeasurementById
};
