const { authorizeRoles } = require('../src/middleware/authMiddleware');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe('authMiddleware authorization unit tests', () => {
  test('TU122 allows users with an authorized role', () => {
    const req = { user: { role: 'Responsavel' } };
    const res = createResponse();
    const next = jest.fn();

    authorizeRoles('Responsavel', 'Administrador')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('TU123 rejects users without an authorized role', () => {
    const req = { user: { role: 'Tecnico' } };
    const res = createResponse();
    const next = jest.fn();

    authorizeRoles('Responsavel')(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

});
