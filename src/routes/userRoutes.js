const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/me', authenticate, userController.getMe);

module.exports = router;
