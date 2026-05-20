const express = require('express');
const batchController = require('../controllers/batchController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', batchController.createBatch);
router.get('/', batchController.listBatches);
router.get('/:id', batchController.getBatchById);
router.patch('/:id/status', batchController.updateBatchStatus);
router.post('/:id/divisions', batchController.addDivision);
router.post('/:id/losses', batchController.addLoss);
router.patch('/:id/productivity', batchController.updateProductivity);

module.exports = router;
