const request = require('supertest');
const app = require('../server'); // Adjust if you export express app from server.js

describe('POST /account/login', () => {
  test('should respond with 200 and login page content on valid data', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({ email: 'test@example.com', password: 'ValidPass123!' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Welcome');
  });

  test('should show errors on invalid login data', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({ email: 'bademail', password: '123' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('error');
  });
});
