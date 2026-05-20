const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTaskById);
router.patch('/:id/status', taskController.updateTaskStatus);

module.exports = router;
