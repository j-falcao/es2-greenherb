const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/me', authenticate, userController.getMe);
router.get('/', authenticate, userController.listUsers);
router.get('/:id', authenticate, userController.getUserById);
router.patch('/:id/role', authenticate, userController.updateUserRole);

module.exports = router;
