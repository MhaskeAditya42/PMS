const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Stock API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/stocks - should return all stocks', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ stock_id: 1, symbol: 'AAPL' }]);
    });

    const res = await request(app).get('/api/stocks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/stocks/:id - should return specific stock', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ stock_id: 1, symbol: 'AAPL' }]);
    });

    const res = await request(app).get('/api/stocks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
  });

  it('POST /api/stocks - should create a stock', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 101 });
    });

    const res = await request(app).post('/api/stocks').send({
      symbol: 'GOOG',
      isin: 'US1234567890',
      series: 'EQ'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.symbol).toBe('GOOG');
  });
});
