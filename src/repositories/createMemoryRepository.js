function createMemoryRepository() {
  let items = [];
  let nextId = 1;

  function create(data) {
    const item = {
      id: String(nextId),
      ...data
    };

    nextId += 1;
    items.push(item);

    return item;
  }

  function findAll() {
    return items;
  }

  function findById(id) {
    return items.find((item) => item.id === String(id));
  }

  function update(id, changes) {
    const item = findById(id);

    if (!item) {
      return null;
    }

    Object.assign(item, changes);
    return item;
  }

  function reset() {
    items = [];
    nextId = 1;
  }

  return {
    create,
    findAll,
    findById,
    update,
    reset
  };
}

module.exports = createMemoryRepository;
