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

module.exports = {
  createUser,
  getMe
};
