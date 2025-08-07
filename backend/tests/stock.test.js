const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => ({ query: jest.fn() }));

describe('Stock API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/stocks - should return all stocks', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ stock_id: 20, symbol: '20MICRONS' }]);
    });

    const res = await request(app).get('/api/stocks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/stocks/:id - should return specific stock', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ stock_id: 20, symbol: '20MICRONS' }]);
    });

    const res = await request(app).get('/api/stocks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.symbol).toBe('20MICRONS');
  });

  it('POST /api/stocks - should create a stock', async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 38 });
    });

    const res = await request(app).post('/api/stocks').send({
      symbol: 'ACE',
      isin: 'ACE',
      series: 'EQ'
    });
    	
    expect(res.statusCode).toBe(201);
    expect(res.body.symbol).toBe('ACE');
  });
});

