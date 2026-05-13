let plans = [];
let nextId = 1;

function create(planData) {
  const plan = {
    id: String(nextId),
    ...planData
  };

  nextId += 1;
  plans.push(plan);

  return plan;
}

function findAll() {
  return plans;
}

function reset() {
  plans = [];
  nextId = 1;
}

module.exports = {
  create,
  findAll,
  reset
};
