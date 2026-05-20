const userService = require('../services/userService');

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

function getMe(req, res) {
  const user = userService.getPublicUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
}

function listUsers(req, res) {
  res.status(200).json(userService.listUsers());
}

function getUserById(req, res) {
  const user = userService.getPublicUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
}

function updateUserRole(req, res) {
  try {
    const user = userService.updateUserRole(req.params.id, req.body.role, req.user);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  getMe,
  listUsers,
  getUserById,
  updateUserRole
};
