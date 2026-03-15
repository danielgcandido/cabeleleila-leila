const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Client, Service } = require('../../src/models');

let clientToken;
let serviceId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Criar serviço de teste
  const service = await Service.create({
    name: 'Corte Teste',
    duration_minutes: 30,
    price: 30.00,
    active: true,
  });
  serviceId = service.id;

  // Registrar e fazer login como cliente
  const res = await request(app).post('/api/auth/register').send({
    name: 'Cliente Teste',
    email: 'cliente@test.com',
    phone: '(14) 99999-9999',
    password: 'senha123',
  });
  clientToken = res.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

function getFutureDate(daysAhead = 5) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

describe('POST /api/appointments', () => {
  it('cria agendamento com sucesso', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        appointment_date: getFutureDate(5),
        appointment_time: '09:00',
        services: [serviceId],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.appointment.status).toBe('pending');
  });

  it('retorna 400 para data no passado', async () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        appointment_date: past.toISOString().split('T')[0],
        appointment_time: '09:00',
        services: [serviceId],
      });
    expect(res.status).toBe(400);
  });

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        appointment_date: getFutureDate(5),
        appointment_time: '09:00',
        services: [serviceId],
      });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/appointments', () => {
  it('lista agendamentos do cliente', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.appointments)).toBe(true);
  });
});
