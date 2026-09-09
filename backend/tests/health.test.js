const request = require('supertest');

jest.mock('../src/config/db', () => ({
  checkConnection: jest.fn().mockResolvedValue(true),
  query: jest.fn(),
  pool: { on: jest.fn() },
}));

const app = require('../src/app');

describe('GET /api/health', () => {
  test('retorna status ok quando o banco esta disponivel', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('rotas administrativas', () => {
  test('bloqueia acesso sem autenticacao', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('404', () => {
  test('rota inexistente retorna erro padronizado', async () => {
    const res = await request(app).get('/api/rota-que-nao-existe');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
