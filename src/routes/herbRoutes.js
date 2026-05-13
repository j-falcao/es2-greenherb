const express = require('express');
const herbController = require('../controllers/herbController');

const router = express.Router();

router.post('/', herbController.importCatalog);
router.get('/', herbController.listHerbs);

module.exports = router;
