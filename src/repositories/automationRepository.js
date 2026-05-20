const createMemoryRepository = require('./createMemoryRepository');

const ruleRepository = createMemoryRepository();
let mode = 'manual';

function getMode() {
  return { mode };
}

function setMode(nextMode) {
  mode = nextMode;
  return getMode();
}

function reset() {
  ruleRepository.reset();
  mode = 'manual';
}

module.exports = {
  createRule: ruleRepository.create,
  findAllRules: ruleRepository.findAll,
  findRuleById: ruleRepository.findById,
  updateRule: ruleRepository.update,
  getMode,
  setMode,
  reset
};
