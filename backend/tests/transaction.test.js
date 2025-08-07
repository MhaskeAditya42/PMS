const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Transaction API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/transactions - should return all transactions', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ transaction_id: 6}]);
    });

    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/transactions/user/:userId - should return user transactions', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ transaction_id: 6, user_id:1 }]);
    });

    const res = await request(app).get('/api/transactions/user/1');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].user_id).toBe(1);
  });
});

