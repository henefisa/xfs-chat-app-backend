import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';
import redis from 'src/configs/Redis';

const testUser = {
  username: 'auth',
  password: '123456',
  email: 'auth@gmail.com',
};

const routes = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refreshToken: '/api/auth/refresh-token',
  profile: '/api/users/profile',
};

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.close();
  redis.quit();
});

describe(`POST ${routes.register}`, () => {
  test('Register user', async () => {
    const response = await request(server).post(routes.register).send(testUser);

    expect(response.status).toBe(201);
    expect(typeof response.body.access_token).toBe('string');
    expect(typeof response.body.refresh_token).toBe('string');
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

    expect(response.status).toBe(400);
    expect(typeof response.body.message).toBe('string');
  });
});

describe(`POST ${routes.login}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([testUser]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

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

  test('Login using email', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
  });
});

describe(`POST ${routes.logout}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([testUser]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let refresh_token = '';

  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    expect(typeof response.body.refresh_token).toBe('string');
    refresh_token = response.body.refresh_token;
  });

  test('Logout user', async () => {
    const response = await request(server)
      .post(routes.logout)
      .send({ refreshToken: refresh_token });

    expect(response.status).toBe(204);
  });
});

describe(`POST ${routes.refreshToken}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([testUser]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let access_token = '';
  let refresh_token = '';

  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    expect(typeof response.body.refresh_token).toBe('string');
    refresh_token = response.body.refresh_token;
    access_token = response.body.access_token;
  });

  test('Get user profile', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser.username);
  });

  test('Refresh token', async () => {
    const response = await request(server)
      .post(routes.refreshToken)
      .send({ refreshToken: refresh_token });

    refresh_token = response.body.refresh_token;
    access_token = response.body.access_token;
  });

  test('Get user profile using new access token', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser.username);
  });
});
