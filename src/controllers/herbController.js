const herbService = require('../services/herbService');

function importCatalog(req, res) {
  try {
    if (req.is('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || req.is('application/vnd.ms-excel')) {
      return res.status(501).json({ message: 'Excel import is not implemented' });
    }

    const herbs = herbService.importCatalog(req.body, req.user);
    return res.status(201).json(herbs);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
}

function listHerbs(req, res) {
  const herbs = herbService.listHerbs();
  res.status(200).json(herbs);
}

function getHerbById(req, res) {
  const herb = herbService.getHerbById(req.params.id);

  if (!herb) {
    return res.status(404).json({ message: 'Herb not found' });
  }

  return res.status(200).json(herb);
}

module.exports = {
  importCatalog,
  listHerbs,
  getHerbById
};
