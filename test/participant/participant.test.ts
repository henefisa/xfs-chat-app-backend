import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';
import redis from 'src/configs/Redis';

const firstUser = {
  username: 'firstUser',
  password: '123456',
  email: 'firstUser@gmail.com',
};

const secondUser = {
  username: 'secondUser',
  password: '123456',
  email: 'secondUser@gmail.com',
};

const thirdUser = {
  username: 'thirdUser',
  password: '123456',
  email: 'thirdUser@gmail.com',
};

let conversationId = '';

const routes = {
  login: '/api/auth/login',
  profile: '/api/users/profile',
  createConversation: '/api/conversations/',
  participant: `/api/participants/${conversationId}`,
  setAdmin: '/api/participants/set-admin',
};

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.close();
  redis.quit();
});

describe(`GET ${routes.participant}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([firstUser, secondUser]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let firstUserId = '';
  let secondUserId = '';
  let thirdUserId = '';
  let accessTokenOfFirstUser = '';
  let accessTokenOfSecondUser = '';
  let accessTokenOfThirdUser = '';

  test('Login first user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: firstUser.username, password: firstUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    accessTokenOfFirstUser = response.body.access_token;
  });

  test('Login second user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: secondUser.username, password: secondUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    accessTokenOfSecondUser = response.body.access_token;
  });

  test('Login third user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: thirdUser.username, password: thirdUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    accessTokenOfThirdUser = response.body.access_token;
  });

  test('Get first user profile', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${accessTokenOfSecondUser}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(secondUser.username);
    firstUserId = response.body.id;
  });
  test('Get second user profile', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${accessTokenOfSecondUser}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(secondUser.username);
    secondUserId = response.body.id;
  });

  test('Get third user profile', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${accessTokenOfThirdUser}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(thirdUser.username);
    thirdUserId = response.body.id;
  });

  test('Create conversation', async () => {
    const response = await request(server)
      .post(routes.createConversation)
      .set('Authorization', `Bearer ${accessTokenOfFirstUser}`)
      .send({ members: [firstUserId, secondUserId] });

    expect(response.status).toBe(200);
    expect(typeof response.body.id).toBe('string');
    conversationId = response.body.id;
  });

  test('Add participant not exist in conversation', async () => {
    const response = await request(server)
      .post(routes.participant)
      .set('Authorization', `Bearer ${accessTokenOfFirstUser}`)
      .send({ members: [thirdUserId] });

    expect(response.status).toBe(200);
    expect(typeof response.body.id).toBe('string');
    conversationId = response.body.id;
  });
});
