import Database from 'src/configs/Database';
import request from 'supertest';
import server from 'src/server';

const routes = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  profile: '/api/users/profile',
  password: '/api/users/password',
  username: '/api/users/check-username-exists',
  email: '/api/users/check-email-exists',
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

const testUser2 = {
  username: 'testuser2',
  password: '123456',
  email: 'sample2@gmail.com',
};

describe(`POST ${routes.register}`, () => {
  test('Register user', async () => {
    const response = await request(server).post(routes.register).send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.password).toBeUndefined();
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

    expect(response.status).toBe(400);
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

  test('Login using email', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
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

describe(`PUT ${routes.profile}`, () => {
  let access_token = '';

  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token = response.body.access_token;
  });

  test('Register second user', async () => {
    const response = await request(server)
      .post(routes.register)
      .send(testUser2);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(testUser2.username);
    expect(typeof response.body.id).toBe('string');
  });

  test('Update user profile without access token', async () => {
    const response = await request(server)
      .put(routes.profile)
      .send({ username: 'newUsername' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('unauthorized');
  });

  test('Update user profile - username', async () => {
    const username = 'newUsername';

    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(username);
  });

  test('Update exist username', async () => {
    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: testUser2.username });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`username_is_exists`);
  });

  test('Update profile full name', async () => {
    const fullName = 'fullName';

    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ fullName });

    expect(response.status).toBe(200);
    expect(response.body.fullName).toBe(fullName);
  });

  test('Update user phone number', async () => {
    const phone = '0328843993';

    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ phone });

    expect(response.status).toBe(200);
    expect(response.body.phone).toBe(phone);
  });

  test('Update user email', async () => {
    const email = 'test@gmail.com';

    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ email });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
  });

  test('Update exist email', async () => {
    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ email: testUser2.email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('email_is_exists');
  });

  test('Update invalid email format', async () => {
    const response = await request(server)
      .put(routes.profile)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ email: 'test123' });

    expect(response.status).toBe(400);
    expect(typeof response.body.message).toBe('string');
  });
});

describe(`PUT ${routes.password}`, () => {
  let access_token = '';
  const newPassword = '123123';

  test('Login user', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token = response.body.access_token;
  });

  test('Update user password without access token', async () => {
    const response = await request(server)
      .put(routes.password)
      .send({ password: newPassword });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('unauthorized');
  });

  test('Update user password', async () => {
    const response = await request(server)
      .put(routes.password)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ password: newPassword });

    expect(response.status).toBe(200);
    expect(typeof response.body.password).toBeUndefined();
  });

  test('Login user using old password', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('unauthorized');
  });

  test('Login user using new password', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: newPassword });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token = response.body.access_token;
  });

  test('Change to user old password', async () => {
    const response = await request(server)
      .put(routes.password)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.password).toBeUndefined();
  });

  test('Test login old password when change back', async () => {
    const response = await request(server)
      .post(routes.login)
      .send({ username: testUser.username, password: testUser.password });

    expect(response.status).toBe(200);
    expect(typeof response.body.access_token).toBe('string');
    access_token = response.body.access_token;
  });
});

describe(`POST ${routes.username}`, () => {
  test('Check exist username', async () => {
    const response = await request(server)
      .post(routes.username)
      .send({ username: testUser.username });

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });

  test('Check non-exist username', async () => {
    const response = await request(server)
      .post(routes.username)
      .send({ username: testUser.username + 1 });

    expect(response.status).toBe(200);
    expect(response.body).toBe(false);
  });
});

describe(`POST ${routes.email}`, () => {
  test('Check exist email', async () => {
    const response = await request(server)
      .post(routes.email)
      .send({ email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });

  test('Check non-exist email', async () => {
    const response = await request(server)
      .post(routes.email)
      .send({ email: testUser.email + 1 });

    expect(response.status).toBe(200);
    expect(response.body).toBe(false);
  });
});
