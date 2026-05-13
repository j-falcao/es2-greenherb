const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username
  };
}

function validateUsername(username) {
  if (!username) {
    throw createError('Username and password are required', 400);
  }

  if (!USERNAME_PATTERN.test(username)) {
    throw createError('Username can only contain letters, numbers, and underscores', 400);
  }
}

async function createUser({ username, password }) {
  validateUsername(username);

  if (!password) {
    throw createError('Username and password are required', 400);
  }

  const existingUser = userRepository.findByUsername(username);

  if (existingUser) {
    throw createError('Username already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepository.create({
    username,
    passwordHash
  });

  return toPublicUser(user);
}

function getPublicUserById(id) {
  return toPublicUser(userRepository.findById(id));
}

module.exports = {
  createUser,
  getPublicUserById,
  validateUsername,
  toPublicUser
};
