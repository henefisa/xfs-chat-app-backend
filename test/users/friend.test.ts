import Database from 'src/configs/Database';
import redis from 'src/configs/Redis';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';
import server from 'src/server';
import request from 'supertest';

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

const routes = {
  login: '/api/auth/login',
  friendRequest: '/api/friends',
  profile: '/api/users/profile',
};

beforeAll(async () => {
  await Database.instance.initialize();
});

afterAll(async () => {
  await Database.instance.close();
  redis.quit();
});

describe(`POST ${routes.friendRequest}`, () => {
  beforeAll(async () => {
    await Database.instance.seedUsers([testUser, testUser2]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let user_id_2 = '';
  let access_token_1 = '';
  let access_token_2 = '';

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

  test('Get user profile 2', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_2}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser2.username);
    user_id_2 = response.body.id;
  });

  test('Send friend request', async () => {
    const response = await request(server)
      .post(routes.friendRequest)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ userTarget: user_id_2 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(EUserFriendRequestStatus.REQUESTED);
  });
});
