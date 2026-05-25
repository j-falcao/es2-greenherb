function sendNotification(notification) {
  return {
    delivered: true,
    notification
  };
}

module.exports = {
  sendNotification
};
