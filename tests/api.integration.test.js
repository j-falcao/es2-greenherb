const request = require('supertest');
const app = require('../src/app');
const alertRepository = require('../src/repositories/alertRepository');
const auditRepository = require('../src/repositories/auditRepository');
const automationRepository = require('../src/repositories/automationRepository');
const batchRepository = require('../src/repositories/batchRepository');
const herbRepository = require('../src/repositories/herbRepository');
const measurementRepository = require('../src/repositories/measurementRepository');
const planRepository = require('../src/repositories/planRepository');
const taskRepository = require('../src/repositories/taskRepository');
const userRepository = require('../src/repositories/userRepository');

describe('GREENHERB API integration tests', () => {
  beforeEach(() => {
    alertRepository.reset();
    auditRepository.reset();
    automationRepository.reset();
    batchRepository.reset();
    herbRepository.reset();
    measurementRepository.reset();
    planRepository.reset();
    taskRepository.reset();
    userRepository.reset();
  });

  async function registerUser(username = 'ana_green', role = 'Responsavel') {
    const response = await request(app)
      .post('/users')
      .send({
        username,
        password: 'Password123',
        role
      });

    expect(response.status).toBe(201);
    return response.body;
  }

  async function login(username = 'ana_green') {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: 'Password123'
      });

    expect(response.status).toBe(200);
    return response.body;
  }

  async function authenticatedAgent(username = 'ana_green', role = 'Responsavel') {
    await registerUser(username, role);
    const auth = await login(username);
    return {
      token: auth.accessToken,
      authHeader: `Bearer ${auth.accessToken}`,
      user: auth.user
    };
  }

  async function createHerb(authHeader, csv = 'name,wateringFrequencyDays,harvestDays\nBasil,2,60') {
    const response = await request(app)
      .post('/herbs')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send(csv);

    expect(response.status).toBe(201);
    return response.body[0];
  }

  async function createPlan(authHeader, herbId, overrides = {}) {
    const response = await request(app)
      .post('/plans')
      .set('Authorization', authHeader)
      .send({
        herbId,
        type: 'regular',
        startDate: '2026-05-13',
        ...overrides
      });

    expect(response.status).toBe(201);
    return response.body;
  }

  async function createBatch(authHeader, planId, overrides = {}) {
    const response = await request(app)
      .post('/batches')
      .set('Authorization', authHeader)
      .send({
        planId,
        code: 'BATCH-001',
        startDate: '2026-05-14',
        expectedYield: 25,
        ...overrides
      });

    expect(response.status).toBe(201);
    return response.body;
  }

  async function createCultivationFlow() {
    const { authHeader } = await authenticatedAgent();
    const herb = await createHerb(authHeader);
    const plan = await createPlan(authHeader, herb.id);
    const batch = await createBatch(authHeader, plan.id);

    return {
      authHeader,
      herb,
      plan,
      batch
    };
  }

  test('TI-01 GET /health returns API status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('TI-02 POST /users creates a public user without passwordHash', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'ana_green',
        password: 'Password123',
        role: 'Responsavel'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  test('TI-03 POST /auth/login returns access and refresh tokens', async () => {
    await registerUser();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'ana_green',
        password: 'Password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        id: '1',
        username: 'ana_green',
        role: 'Responsavel'
      }
    });
  });

  test('TI-08 access token returned from login authenticates protected endpoints', async () => {
    await registerUser();

    const auth = await login();

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${auth.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
  });

  test('TI-18 refresh token returned from login creates a valid access token', async () => {
    await registerUser();

    const auth = await login();

    const refresh = await request(app)
      .post('/auth/refresh')
      .send({
        refreshToken: auth.refreshToken
      });

    expect(refresh.status).toBe(200);
    expect(refresh.body).toEqual({
      accessToken: expect.any(String)
    });

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${refresh.body.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: '1',
      username: 'ana_green',
      role: 'Responsavel'
    });
  });

  test('TI-04 protected endpoint rejects missing Authorization header', async () => {
    const response = await request(app).get('/plans');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Missing or invalid authorization header'
    });
  });

  test('TI-05 protected endpoint rejects invalid bearer token', async () => {
    const response = await request(app)
      .get('/plans')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or expired token'
    });
  });

  test('TI-06 POST /herbs imports CSV and GET /herbs/:id confirms persistence', async () => {
    const { authHeader } = await authenticatedAgent();
    const herb = await createHerb(
      authHeader,
      'name,scientificName,wateringFrequencyDays,sunlight,harvestDays\nBasil,Ocimum basilicum,2,full,60'
    );

    expect(herb).toMatchObject({
      id: '1',
      name: 'Basil',
      scientificName: 'Ocimum basilicum',
      wateringFrequencyDays: 2,
      sunlight: 'full',
      harvestDays: 60
    });

    const persisted = await request(app)
      .get(`/herbs/${herb.id}`)
      .set('Authorization', authHeader);

    expect(persisted.status).toBe(200);
    expect(persisted.body).toEqual(herb);
  });

  test('TI-07 POST /herbs rejects invalid CSV rows', async () => {
    const { authHeader } = await authenticatedAgent();

    const response = await request(app)
      .post('/herbs')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send('name,wateringFrequencyDays,harvestDays\nBasil,2,60\nMint,,45');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('TI-09 POST /plans creates a regular plan and calculates expectedHarvestDate', async () => {
    const { authHeader } = await authenticatedAgent();
    const herb = await createHerb(authHeader);
    const plan = await createPlan(authHeader, herb.id);

    expect(plan).toMatchObject({
      id: '1',
      userId: '1',
      herbId: herb.id,
      type: 'regular',
      startDate: '2026-05-13',
      cycleDurationDays: 60,
      expectedHarvestDate: '2026-07-12'
    });
  });

  test('TI-10 POST /batches associates a batch with a plan and persists it', async () => {
    const { authHeader, plan } = await createCultivationFlow();

    const response = await request(app)
      .get('/batches/1')
      .set('Authorization', authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: '1',
      planId: plan.id,
      code: 'BATCH-001',
      status: 'ativo'
    });
  });

  test('TI-11 POST /measurements creates an aviso alert for one limit violation', async () => {
    const { authHeader, batch } = await createCultivationFlow();

    const response = await request(app)
      .post('/measurements')
      .set('Authorization', authHeader)
      .send({
        batchId: batch.id,
        temperature: 29,
        humidity: 70,
        luminosity: 15000,
        measuredAt: '2026-05-14T10:00:00.000Z'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: '1',
      batchId: batch.id,
      generatedAlert: {
        type: 'aviso',
        resource: 'measurements',
        resourceId: '1'
      }
    });
  });

  test('TI-12 POST /measurements creates a critico alert for multiple limit violations', async () => {
    const { authHeader, batch } = await createCultivationFlow();

    const response = await request(app)
      .post('/measurements')
      .set('Authorization', authHeader)
      .send({
        batchId: batch.id,
        temperature: 29,
        humidity: 39,
        luminosity: 15000,
        measuredAt: '2026-05-14T10:00:00.000Z'
      });

    expect(response.status).toBe(201);
    expect(response.body.generatedAlert).toMatchObject({
      type: 'critico',
      status: 'ativo'
    });
  });

  test('TI-13 PATCH /alerts/:id/ignore rejects missing justification', async () => {
    const { authHeader } = await authenticatedAgent();
    const alert = await request(app)
      .post('/alerts')
      .set('Authorization', authHeader)
      .send({
        type: 'aviso',
        message: 'Low humidity'
      });

    expect(alert.status).toBe(201);

    const response = await request(app)
      .patch(`/alerts/${alert.body.id}/ignore`)
      .set('Authorization', authHeader)
      .send({
        justification: ''
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('TI-14 PATCH /alerts/:id/ignore accepts a valid justification', async () => {
    const { authHeader } = await authenticatedAgent();
    const alert = await request(app)
      .post('/alerts')
      .set('Authorization', authHeader)
      .send({
        type: 'aviso',
        message: 'Low humidity'
      });

    const response = await request(app)
      .patch(`/alerts/${alert.body.id}/ignore`)
      .set('Authorization', authHeader)
      .send({
        justification: 'False positive'
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: alert.body.id,
      status: 'ignorado',
      ignoredJustification: 'False positive'
    });
  });

  test('TI-15 task endpoint flow creates, reads, and updates task status', async () => {
    const { authHeader, batch } = await createCultivationFlow();

    const created = await request(app)
      .post('/tasks')
      .set('Authorization', authHeader)
      .send({
        batchId: batch.id,
        type: 'rega',
        dueDate: '2026-05-15',
        assignedTo: '1',
        notes: 'Morning watering'
      });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      id: '1',
      batchId: batch.id,
      type: 'rega',
      status: 'pendente'
    });

    const fetched = await request(app)
      .get(`/tasks/${created.body.id}`)
      .set('Authorization', authHeader);

    expect(fetched.status).toBe(200);
    expect(fetched.body).toEqual(created.body);

    const updated = await request(app)
      .patch(`/tasks/${created.body.id}/status`)
      .set('Authorization', authHeader)
      .send({
        status: 'concluida'
      });

    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe('concluida');
  });

  test('TI-16 automation endpoint flow creates, reads, updates rule, and sets mode', async () => {
    const { authHeader } = await authenticatedAgent();

    const created = await request(app)
      .post('/automation/rules')
      .set('Authorization', authHeader)
      .send({
        name: 'High temperature ventilation',
        trigger: 'temperature_above_max',
        action: 'open_ventilation'
      });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      id: '1',
      enabled: true
    });

    const fetched = await request(app)
      .get(`/automation/rules/${created.body.id}`)
      .set('Authorization', authHeader);

    expect(fetched.status).toBe(200);
    expect(fetched.body.name).toBe('High temperature ventilation');

    const updated = await request(app)
      .patch(`/automation/rules/${created.body.id}`)
      .set('Authorization', authHeader)
      .send({
        enabled: false
      });

    expect(updated.status).toBe(200);
    expect(updated.body.enabled).toBe(false);

    const mode = await request(app)
      .put('/automation/mode')
      .set('Authorization', authHeader)
      .send({
        mode: 'automatico'
      });

    expect(mode.status).toBe(200);
    expect(mode.body).toEqual({ mode: 'automatico' });
  });

  test('TI-17 GET /reports exports a CSV report with headers and content', async () => {
    const { authHeader, plan } = await createCultivationFlow();

    const response = await request(app)
      .get('/reports')
      .query({
        resource: 'plans',
        format: 'csv'
      })
      .set('Authorization', authHeader);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/csv/);
    expect(response.headers['content-disposition']).toBe('attachment; filename="plans.csv"');
    expect(response.text).toContain('id,userId,herbId,type,startDate');
    expect(response.text).toContain(`${plan.id},1,1,regular,2026-05-13`);
  });

  test('TI-20 GET /audit allows Administrador users', async () => {
    const { authHeader } = await authenticatedAgent('admin_green', 'Administrador');

    const response = await request(app)
      .get('/audit')
      .set('Authorization', authHeader);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        username: 'admin_green',
        action: 'create',
        resource: 'users'
      })
    ]));
  });

  test('TI-21 GET /audit rejects authenticated non-admin users', async () => {
    const { authHeader } = await authenticatedAgent('responsavel_green', 'Responsavel');

    const response = await request(app)
      .get('/audit')
      .set('Authorization', authHeader);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Forbidden'
    });
  });

  test('TI-19 unknown route returns 404', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Route not found' });
  });
});
