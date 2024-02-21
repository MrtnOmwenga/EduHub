const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../App');

const api = supertest(app);

describe('Test login url', () => {
  test('Valid credentials return token', async () => {
    const credentials = {
      email: 'kevincozner@gmail.com',
      password: 'foobar',
      UserType: 'Student',
    };

    const response = await api
      .post('/services/login')
      .send(credentials)
      .expect(200);

      expect(response.body.token).toBeDefined();
  }, 100000);

  test('Wrong credentials rejected with 401 Unauthorized error', async () => {
    const credentials = {
      email: 'kevincozner@gmail.com',
      password: 'kevincozner',
      UserType: 'Student',
    };

    const response = await api
      .post('/services/login')
      .send(credentials)
      .expect(401);

    expect(response.body.error).toBeDefined();
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
