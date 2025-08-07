const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Wallet API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/wallet/:userId - should return wallet for user', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ user_id: 2, balance:5500}]);
    });

    const res = await request(app).get('/api/wallet/4');
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(5500);
  });

  it('POST /api/wallet/add - should add balance to wallet', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const res = await request(app).post('/api/wallet/add').send({
      user_id: 2,
      amount: 5500
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/successfully/i);
  });
});
