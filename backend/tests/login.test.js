// Jest test cases for login

const request = require('supertest');
const app = require('../app');
const db = require('../utils/db');

describe('Login API', () => {
  test('POST /api/login - should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  
});
afterAll(() => {
  db.end();
});