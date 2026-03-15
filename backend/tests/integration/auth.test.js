const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Client } = require('../../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  await Client.destroy({ where: {}, truncate: true });
});

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Maria Silva',
    email: 'maria@test.com',
    phone: '(14) 99999-9999',
    password: 'senha123',
  };

  it('registra um novo cliente com sucesso', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.role).toBe('client');
  });

  it('retorna 409 ao tentar registrar email duplicado', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'invalido', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Maria Silva',
      email: 'maria@test.com',
      phone: '(14) 99999-9999',
      password: 'senha123',
    });
  });

  it('faz login com credenciais válidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'maria@test.com',
      password: 'senha123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('retorna 401 com senha errada', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'maria@test.com',
      password: 'errada',
    });
    expect(res.status).toBe(401);
  });

  it('retorna 401 com email inexistente', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'naoexiste@test.com',
      password: 'senha123',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/profile', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Maria Silva',
      email: 'maria@test.com',
      phone: '(14) 99999-9999',
      password: 'senha123',
    });
    token = res.body.data.token;
  });

  it('retorna perfil com token válido', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('maria@test.com');
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });
});
