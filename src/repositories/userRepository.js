let users = [];
let nextId = 1;

function create(userData) {
  const user = {
    id: String(nextId),
    ...userData
  };

  nextId += 1;
  users.push(user);

  return user;
}

function findByUsername(username) {
  return users.find((user) => user.username === username);
}

function findById(id) {
  return users.find((user) => user.id === String(id));
}

function reset() {
  users = [];
  nextId = 1;
}

module.exports = {
  create,
  findByUsername,
  findById,
  reset
};
