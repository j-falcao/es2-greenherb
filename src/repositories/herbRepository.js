let herbs = [];
let nextId = 1;

function create(herbData) {
  const herb = {
    id: String(nextId),
    ...herbData
  };

  nextId += 1;
  herbs.push(herb);

  return herb;
}

function findAll() {
  return herbs;
}

function findById(id) {
  return herbs.find((herb) => herb.id === String(id));
}

function findByName(name) {
  return herbs.find((herb) => herb.name.toLowerCase() === name.toLowerCase());
}

function reset() {
  herbs = [];
  nextId = 1;
}

module.exports = {
  create,
  findAll,
  findById,
  findByName,
  reset
};
