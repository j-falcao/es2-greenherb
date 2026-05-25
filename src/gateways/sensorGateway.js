function readEnvironment() {
  return {
    temperature: 22,
    humidity: 60,
    luminosity: 15000,
    sensorOK: true,
    measuredAt: new Date().toISOString()
  };
}

module.exports = {
  readEnvironment
};
