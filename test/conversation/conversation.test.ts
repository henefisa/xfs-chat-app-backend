import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';
import redis from 'src/configs/Redis';

const testUser = {
  username: 'testuser',
  password: '123456',
  email: 'sample@gmail.com',
};

const testUser2 = {
  username: 'testuser2',
  password: '123456',
  email: 'sample2@gmail.com',
};

const testUser3 = {
  username: 'testuser3',
  password: '123456',
  email: 'sample3@gmail.com',
};

const routes = {
  login: '/api/auth/login',
  conversations: '/api/conversations',
  groups: '/api/conversations/groups',
  profile: '/api/users/profile',
};

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.close();
  redis.quit();
});

describe(`POST ${routes.conversations}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([testUser, testUser2, testUser3]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let user_id_1 = '';
  let user_id_2 = '';
  let user_id_3 = '';
  let access_token_1 = '';
  let access_token_2 = '';
  let access_token_3 = '';

  test('Login user 1', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token_1 = response.body.access_token;
  });

  test('Login user 2', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser2.username, password: testUser2.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token_2 = response.body.access_token;
  });

  test('Login user 3', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser3.username, password: testUser3.password });
    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token_3 = response.body.access_token;
  });

  test('Get user profile 1', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_1}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    user_id_1 = response.body.id;
  });

  test('Get user profile 2', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_2}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser2.username);
    user_id_2 = response.body.id;
  });

  test('Get user profile 3', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_3}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser3.username);
    user_id_3 = response.body.id;
  });

  test('Create conversation user vs user', async () => {
    const response = await request(server)
      .post(routes.conversations)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_1, user_id_2] });

    expect(response.status).toBe(201);
    expect(response.body.is_group).toBe(false);
  });

  test('create conversation group', async () => {
    const response = await request(server)
      .post(routes.conversations)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_1, user_id_2, user_id_3] });

    expect(response.status).toBe(201);
    expect(response.body.is_group).toBe(true);
  });

  test('create duplicate conversation ', async () => {
    const response = await request(server)
      .post(routes.conversations)
      .set('Authorization', `Bearer ${access_token_2}`)
      .send({ members: [user_id_1, user_id_2] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`conversation_is_exists`);
  });
});
