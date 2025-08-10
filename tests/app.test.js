const request = require('supertest');
const app = require('../server'); // adjust path if needed

describe('Basic Integration Tests', () => {
  test('GET / should return 200 and contain homepage content', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Welcome/i); // Adjust regex to something on your homepage
  });

  test('GET /admin/dashboard requires auth and returns 302 redirect if unauthenticated', async () => {
    const res = await request(app).get('/admin/dashboard');
    expect([401, 302]).toContain(res.statusCode); // Depending on your auth, it might redirect or 401
  });

  test('GET /inventory should return 200', async () => {
    const res = await request(app).get('/inventory');
    expect(res.statusCode).toBe(200);
  });

  // Add more route tests as you want...
});
