const request = require('supertest');
const app = require('../server');

describe('Admin Login API', () => {
  test('should return 401 when invalid login', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});
