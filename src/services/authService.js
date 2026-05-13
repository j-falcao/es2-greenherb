const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const {
  getAccessSecret,
  getRefreshSecret,
  getAccessExpiresIn,
  getRefreshExpiresIn
} = require('./tokenConfig');
const { toPublicUser, validateUsername } = require('./userService');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function createAccessToken(user) {
  return jwt.sign(
    { username: user.username },
    getAccessSecret(),
    {
      subject: user.id,
      expiresIn: getAccessExpiresIn()
    }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { username: user.username },
    getRefreshSecret(),
    {
      subject: user.id,
      expiresIn: getRefreshExpiresIn()
    }
  );
}

async function login({ username, password }) {
  validateUsername(username);

  if (!password) {
    throw createError('Username and password are required', 400);
  }

  const user = userRepository.findByUsername(username);

  if (!user) {
    throw createError('Invalid username or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw createError('Invalid username or password', 401);
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
    user: toPublicUser(user)
  };
}

function refresh({ refreshToken }) {
  if (!refreshToken) {
    throw createError('Refresh token is required', 400);
  }

  try {
    const payload = jwt.verify(refreshToken, getRefreshSecret());
    const user = userRepository.findById(payload.sub);

    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      accessToken: createAccessToken(user)
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createError('Invalid or expired refresh token', 401);
  }
}

module.exports = {
  login,
  refresh,
  createAccessToken,
  createRefreshToken
};
