const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;
const VALID_ROLES = ['Tecnico', 'Responsavel', 'Administrador'];
const DEFAULT_ROLE = 'Tecnico';

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
    username: user.username,
    role: user.role
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

function validateRole(role) {
  if (!VALID_ROLES.includes(role)) {
    throw createError('Invalid role', 400);
  }
}

async function createUser({ username, password, role = DEFAULT_ROLE }) {
  validateUsername(username);
  validateRole(role);

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
    passwordHash,
    role
  });

  auditService.recordAudit({
    userId: user.id,
    username: user.username,
    action: 'create',
    resource: 'users',
    resourceId: user.id
  });

  return toPublicUser(user);
}

function getPublicUserById(id) {
  return toPublicUser(userRepository.findById(id));
}

function listUsers() {
  return userRepository.findAll().map(toPublicUser);
}

function updateUserRole(id, role, actor) {
  const user = userRepository.findById(id);

  if (!user) {
    throw createError('User not found', 404);
  }

  validateRole(role);

  const updatedUser = userRepository.update(id, { role });

  auditService.recordAudit({
    userId: actor && actor.id,
    username: actor && actor.username,
    action: 'update_role',
    resource: 'users',
    resourceId: updatedUser.id
  });

  return toPublicUser(updatedUser);
}

module.exports = {
  createUser,
  getPublicUserById,
  listUsers,
  updateUserRole,
  validateUsername,
  validateRole,
  toPublicUser
};
