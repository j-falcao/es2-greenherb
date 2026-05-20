const createMemoryRepository = require('./createMemoryRepository');

const repository = createMemoryRepository();

function findByUsername(username) {
  return repository.findAll().find((user) => user.username === username);
}

module.exports = {
  create: repository.create,
  findByUsername,
  findById: repository.findById,
  findAll: repository.findAll,
  update: repository.update,
  reset: repository.reset
};
