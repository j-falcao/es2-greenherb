const userService = require('../src/services/userService');
const userRepository = require('../src/repositories/userRepository');

describe('userService registration unit tests', () => {
  beforeEach(() => {
    userRepository.reset();
  });

  test('TU12 creates a user with username and hashed password', async () => {
    const user = await userService.createUser({
      username: 'ana_green',
      password: 'Password123'
    });

    const storedUser = userRepository.findByUsername('ana_green');

    expect(user).toEqual({
      id: '1',
      username: 'ana_green',
      role: 'Tecnico'
    });

    expect(storedUser.passwordHash).toEqual(expect.any(String));
    expect(storedUser.passwordHash).not.toBe('Password123');
    expect(user.passwordHash).toBeUndefined();
  });

  test.each([
    ['TU21', 'Tecnico'],
    ['TU22', 'Responsavel'],
    ['TU23', 'Administrador']
  ])('%s creates a user with role %s', async (testId, role) => {
    const user = await userService.createUser({
      username: `ana_${role}`,
      password: 'Password123',
      role
    });

    expect(user).toEqual({
      id: '1',
      username: `ana_${role}`,
      role
    });
  });

  test('TU24 rejects invalid role during registration', async () => {
    await expect(userService.createUser({
      username: 'ana_green',
      password: 'Password123',
      role: 'Gestor'
    })).rejects.toMatchObject({
      statusCode: 400
    });
  });

  test('TU13 rejects a duplicate username', async () => {
    await userService.createUser({
      username: 'ana_green',
      password: 'Password123'
    });

    await expect(userService.createUser({
      username: 'ana_green',
      password: 'Password123'
    })).rejects.toMatchObject({
      statusCode: 409
    });
  });

  test.each([
    ['TU14', null],
    ['TU15', ''],
    ['TU16', 'ana green!'],
    ['TU17', 'ana-green'],
    ['TU18', 'ana.green']
  ])('%s rejects invalid username during registration', async (testId, username) => {
    await expect(userService.createUser({
      username,
      password: 'Password123'
    })).rejects.toMatchObject({
      statusCode: 400
    });
  });

  test.each([
    ['TU19', null],
    ['TU20', '']
  ])('%s rejects missing password during registration', async (testId, password) => {
    await expect(userService.createUser({
      username: 'ana_green',
      password
    })).rejects.toMatchObject({
      statusCode: 400
    });
  });
});
