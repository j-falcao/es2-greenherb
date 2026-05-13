function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || 'greenherb_default_access_secret';
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || 'greenherb_default_refresh_secret';
}

function getAccessExpiresIn() {
  return process.env.JWT_ACCESS_EXPIRES_IN || '15m';
}

function getRefreshExpiresIn() {
  return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
}

module.exports = {
  getAccessSecret,
  getRefreshSecret,
  getAccessExpiresIn,
  getRefreshExpiresIn
};
