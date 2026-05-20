const measurementService = require('../services/measurementService');

function handleError(res, error) {
  res.status(error.statusCode || 500).json({ message: error.message });
}

function createMeasurement(req, res) {
  try {
    res.status(201).json(measurementService.createMeasurement({ ...req.body, user: req.user }));
  } catch (error) {
    handleError(res, error);
  }
}

function listMeasurements(req, res) {
  res.status(200).json(measurementService.listMeasurements());
}

function getMeasurementById(req, res) {
  try {
    res.status(200).json(measurementService.getMeasurementById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  createMeasurement,
  listMeasurements,
  getMeasurementById
};
