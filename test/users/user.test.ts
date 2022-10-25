import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';

const routes = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  profile: '/api/users/profile',
};

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

describe(`POST ${routes.register}`, () => {
  test('Register user', async () => {
    const response = await request(server).post(routes.register).send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(testUser.username);
    expect(typeof response.body.id).toBe('string');
    return;
  });

  test('Register user without username', async () => {
    const response = await request(server)
      .post(routes.register)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(400);
  });

  test('Register user without password', async () => {
    const response = await request(server)
      .post(routes.register)
      .send({ username: testUser.username, email: testUser.email });

    expect(response.status).toBe(400);
  });

  test('Register user without username', async () => {
    const response = await request(server)
      .post(routes.register)
      .send({ password: testUser.password, email: testUser.email });

    expect(response.status).toBe(400);
  });

  test('Register user with empty body', async () => {
    const response = await request(server).post(routes.register).send();

    expect(response.status).toBe(400);
  });

  test('Register same user', async () => {
    const response = await request(server).post(routes.register).send(testUser);

    expect(response.status).toBe(200);
    expect(typeof response.body.message).toBe('string');
  });
});

describe(`POST ${routes.login}`, () => {
  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
  });

  test('Login user with wrong password', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password + 1 });

    expect(response.status).toBe(401);
    expect(typeof response.body.message).toBe('string');
  });

  test('Login user with wrong username', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username + 1, password: testUser.password });

    expect(response.status).toBe(401);
    expect(typeof response.body.message).toBe('string');
  });

  test('Login user with empty body', async () => {
    const response = await request(server).post(routes.login).send();

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe(`GET ${routes.profile}`, () => {
  let access_token = '';

  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token = response.body.access_token;
  });

  test('Get user profile', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.password).toBeUndefined();
  });

  test('Get user profile without access token', async () => {
    const response = await request(server).get(routes.profile);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('unauthorized');
  });
});
