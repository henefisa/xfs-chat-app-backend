import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.cleanDatabases();
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

const testUser = {
  username: 'testuser',
  password: '123456',
  email: 'sample@gmail.com',
};

describe('POST /api/auth/register', () => {
  const path = '/api/auth/register';

  test('Register user', async () => {
    const response = await request(server).post(path).send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(testUser.username);
    expect(typeof response.body.id).toBe('string');
    return;
  });

  test('Register user without username', async () => {
    const response = await request(server)
      .post(path)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(400);
  });

  test('Register user without password', async () => {
    const response = await request(server)
      .post(path)
      .send({ username: testUser.username, email: testUser.email });

    expect(response.status).toBe(400);
  });

  test('Register user without username', async () => {
    const response = await request(server)
      .post(path)
      .send({ password: testUser.password, email: testUser.email });

    expect(response.status).toBe(400);
  });

  test('Register user with empty body', async () => {
    const response = await request(server).post(path).send();

    expect(response.status).toBe(400);
  });

  test('Register same user', async () => {
    const response = await request(server).post(path).send(testUser);

    expect(response.status).toBe(400);
    expect(typeof response.body.message).toBe('string');
  });
});

describe('POST api/auth/login', () => {
  const path = '/api/auth/login';

  test('Login user', async () => {
    const response = await request(server)
      .post(path)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
  });

  test('Login user with wrong password', async () => {
    const response = await request(server)
      .post(path)
      .send({ username: testUser.username, password: testUser.password + 1 });

    expect(response.status).toBe(401);
    expect(typeof response.body.message).toBe('string');
  });

  test('Login user with wrong username', async () => {
    const response = await request(server)
      .post(path)
      .send({ username: testUser.username + 1, password: testUser.password });

    expect(response.status).toBe(401);
    expect(typeof response.body.message).toBe('string');
  });

  test('Login user with empty body', async () => {
    const response = await request(server).post(path).send();

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
