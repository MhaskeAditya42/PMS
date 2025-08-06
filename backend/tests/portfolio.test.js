const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

jest.mock('../utils/db', () => {
  return { query: jest.fn() };
});

describe('Portfolio API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/portfolio/:userId', () => {
    it('should return portfolio data for a valid user', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, [{ stock_id: 1, quantity: 10 }]);
      });

      const res = await request(app).get('/api/portfolio/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ stock_id: 1, quantity: 10 }]);
    });

    it('should return 404 for user with no portfolio', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const res = await request(app).get('/api/portfolio/999');
      expect(res.statusCode).toBe(404);
    });

    it('should return 500 on db error', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('DB error'));
      });

      const res = await request(app).get('/api/portfolio/1');
      expect(res.statusCode).toBe(500);
    });
  });
});
