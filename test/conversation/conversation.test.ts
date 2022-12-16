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

const testUser4 = {
  username: 'testuser4',
  password: '123456',
  email: 'sample4@gmail.com',
};

const testUser5 = {
  username: 'testuser5',
  password: '123456',
  email: 'sample5@gmail.com',
};

const routes = {
  login: '/api/auth/login',
  conversations: '/api/conversations',
  groups: '/api/conversations/groups',
  profile: '/api/users/profile',
  participant: `/api/participants`,
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
    await Database.instance.seedUsers([
      testUser,
      testUser2,
      testUser3,
      testUser4,
      testUser5,
    ]);
  });

  afterAll(async () => {
    await Database.instance.cleanDatabases();
  });

  let user_id_1 = '';
  let user_id_2 = '';
  let user_id_3 = '';
  let user_id_4 = '';
  let user_id_5 = '';
  let access_token_1 = '';
  let access_token_2 = '';
  let access_token_3 = '';
  let access_token_4 = '';
  let access_token_5 = '';
  let conversationId = '';
  let groupConversationId = '';

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

  test('Login user 4', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser4.username, password: testUser4.password });
    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token_4 = response.body.access_token;
  });
  test('Login user 5', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser5.username, password: testUser5.password });
    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token_5 = response.body.access_token;
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

  test('Get user profile 4', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_4}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser4.username);
    user_id_4 = response.body.id;
  });
  test('Get user profile 5', async () => {
    const response = await request(server)
      .get(routes.profile)
      .set('Authorization', `Bearer ${access_token_5}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(testUser5.username);
    user_id_5 = response.body.id;
  });

  test('Create couple conversation', async () => {
    const response = await request(server)
      .post(routes.conversations)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_1, user_id_2] });

    expect(response.status).toBe(201);
    expect(response.body.isGroup).toBe(false);
    expect(typeof response.body.id).toBe('string');
    conversationId = response.body.id;
  });

  test('Create group conversation', async () => {
    const response = await request(server)
      .post(routes.conversations)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_1, user_id_2, user_id_3] });

    expect(response.status).toBe(201);
    expect(response.body.isGroup).toBe(true);
    expect(typeof response.body.id).toBe('string');
    groupConversationId = response.body.id;
  });

  test('Add participant without token', async () => {
    const response = await request(server)
      .post(routes.participant + `/${conversationId}`)
      .send({ members: [user_id_3] });

    expect(response.status).toBe(401);
  });

  test('Add participant into couple conversation', async () => {
    const response = await request(server)
      .post(routes.participant + `/${conversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_3] });

    expect(response.status).toBe(403);
  });

  test('Add participant not exist in group conversation', async () => {
    const response = await request(server)
      .post(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_4] });

    expect(response.status).toBe(201);
  });
  test('Add participant exist in group conversation', async () => {
    const response = await request(server)
      .post(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ members: [user_id_4] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('member_is_exists');
  });

  test('Delete participant without token', async () => {
    const response = await request(server)
      .delete(routes.participant + `/${groupConversationId}`)
      .send({ userId: user_id_4 });

    expect(response.status).toBe(401);
  });

  test('Delete participant with role admin', async () => {
    const response = await request(server)
      .delete(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ userId: user_id_2 });

    expect(response.status).toBe(204);
  });
  test('Delete participant without role admin', async () => {
    const response = await request(server)
      .delete(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_3}`)
      .send({ userId: user_id_2 });

    expect(response.status).toBe(403);
  });
  test('Delete participant not exist in conversation', async () => {
    const response = await request(server)
      .delete(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`)
      .send({ userId: user_id_5 });

    expect(response.status).toBe(400);
  });

  test('get participants without token', async () => {
    const response = await request(server).get(
      routes.participant + `/${conversationId}`
    );

    expect(response.status).toBe(401);
  });
  test('get participants in couple conversation', async () => {
    const response = await request(server)
      .get(routes.participant + `/${conversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(2);
  });
  test('get participants in group conversation', async () => {
    const response = await request(server)
      .get(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_1}`);

    expect(response.status).toBe(200);
  });
  test('get participants by user not exist in conversation', async () => {
    const response = await request(server)
      .get(routes.participant + `/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_5}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('member_not_exist');
  });
  test('Set group admin without token', async () => {
    const response = await request(server)
      .post(routes.participant + `/set-admin/${groupConversationId}`)
      .send({ userId: user_id_2 });
    expect(response.status).toBe(401);
  });
  test('Set group admin by user not exist in conversation', async () => {
    const response = await request(server)
      .post(routes.participant + `/set-admin/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_5}`)
      .send({ userId: user_id_2 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('participant_not_found');
  });
  test('Set group admin in conversation without role admin', async () => {
    const response = await request(server)
      .post(routes.participant + `/set-admin/${groupConversationId}`)
      .set('Authorization', `Bearer ${access_token_3}`)
      .send({ userId: user_id_2 });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('forbidden');
  });
});
