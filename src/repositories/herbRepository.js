const createMemoryRepository = require('./createMemoryRepository');

const repository = createMemoryRepository();

function findByName(name) {
  if (!name) {
    return undefined;
  }

  return repository.findAll().find((herb) => herb.name.toLowerCase() === name.toLowerCase());
}

module.exports = {
  create: repository.create,
  findAll: repository.findAll,
  findById: repository.findById,
  findByName,
  reset: repository.reset
};
