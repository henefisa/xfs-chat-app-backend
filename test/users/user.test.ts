import Database from 'test/Database';
import request from 'supertest';
import server from 'src/index';

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.close();
});

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

describe('Test connection', () => {
  test('GET /', async () => {
    const response = await request(server).get('/');

    expect(response.status).toBe(200);
    return;
  });
});

describe('POST /api/auth/login', () => {
  const path = '/api/auth/login';

  test('Register user', async () => {
    const response = await request(server).post(path).send({
      username: 'testuser',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });
});
