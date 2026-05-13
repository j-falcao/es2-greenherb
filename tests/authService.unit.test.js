const authService = require('../src/services/authService');
const userService = require('../src/services/userService');
const userRepository = require('../src/repositories/userRepository');
const jwt = require('jsonwebtoken');
const { getAccessSecret, getRefreshSecret } = require('../src/services/tokenConfig');

describe('authService unit tests', () => {
  beforeEach(() => {
    userRepository.reset();
  });

  async function createUser() {
    return userService.createUser({
      username: 'ana_green',
      password: 'Password123',
      role: 'Responsavel'
    });
  }

  test('TU01 accepts valid username and password', async () => {
    await createUser();

    const result = await authService.login({
      username: 'ana_green',
      password: 'Password123'
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user).toEqual({
      id: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });

    expect(jwt.verify(result.accessToken, getAccessSecret())).toMatchObject({
      sub: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
    expect(jwt.verify(result.refreshToken, getRefreshSecret())).toMatchObject({
      sub: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
  });

  test('TU02 rejects login with wrong password', async () => {
    await createUser();

    await expect(authService.login({
      username: 'ana_green',
      password: 'WrongPassword123'
    })).rejects.toMatchObject({
      statusCode: 401
    });
  });

  test('TU03 rejects login with non-existing user', async () => {
    await expect(authService.login({
      username: 'missing_user',
      password: 'Password123'
    })).rejects.toMatchObject({
      statusCode: 401
    });
  });

  test.each([
    ['TU04', null, 'Password123'],
    ['TU05', '', 'Password123'],
    ['TU06', 'ana green!', 'Password123'],
    ['TU07', 'ana_green', null],
    ['TU08', 'ana_green', ''],
    ['TU09', '', '']
  ])('%s rejects invalid login input', async (testId, username, password) => {
    await createUser();

    await expect(authService.login({ username, password })).rejects.toMatchObject({
      statusCode: 400
    });
  });

  test('TU10 accepts valid refresh token and creates new access token', async () => {
    await createUser();

    const loginResult = await authService.login({
      username: 'ana_green',
      password: 'Password123'
    });

    const refreshResult = authService.refresh({
      refreshToken: loginResult.refreshToken
    });

    expect(refreshResult.accessToken).toEqual(expect.any(String));
    expect(jwt.verify(refreshResult.accessToken, getAccessSecret())).toMatchObject({
      sub: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
  });

  test('TU11 rejects invalid refresh token', () => {
    expect(() => authService.refresh({
      refreshToken: 'invalid.token.value'
    })).toThrow('Invalid or expired refresh token');
  });
});
