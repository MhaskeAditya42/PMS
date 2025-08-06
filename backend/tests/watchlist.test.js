const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Watchlist API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/watchlist/:userId - should return watchlist', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ stock_id: 1 }]);
    });

    const res = await request(app).get('/api/watchlist/1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/watchlist/:userId - should add to watchlist', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 99 });
    });

    const res = await request(app).post('/api/watchlist/1').send({ stock_id: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.watchlist_id).toBe(99);
  });

  it('DELETE /api/watchlist/:userId - should remove from watchlist', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const res = await request(app).delete('/api/watchlist/1').send({ stock_id: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removed/i);
  });
});
