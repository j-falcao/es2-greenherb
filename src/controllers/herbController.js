const herbService = require('../services/herbService');

function importCatalog(req, res) {
  try {
    const herbs = herbService.importCatalog(req.body);
    res.status(201).json(herbs);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

function listHerbs(req, res) {
  const herbs = herbService.listHerbs();
  res.status(200).json(herbs);
}

module.exports = {
  importCatalog,
  listHerbs
};
