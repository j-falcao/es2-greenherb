const reportService = require('../services/reportService');

function exportReport(req, res) {
  try {
    const report = reportService.exportReport({
      resource: req.query.resource,
      format: req.query.format || 'csv'
    });

    res.set('Content-Type', report.contentType);
    res.set('Content-Disposition', `attachment; filename="${report.filename}"`);
    res.status(200).send(report.body);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

module.exports = {
  exportReport
};
