const express = require('express');
const herbController = require('../controllers/herbController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', herbController.importCatalog);
router.get('/', herbController.listHerbs);
router.get('/:id', herbController.getHerbById);

module.exports = router;
