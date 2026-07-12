import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { env } from '../config/env';
import { User } from '../models/user.model';

const validUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toMatchObject({
      name: validUser.name,
      email: validUser.email,
      role: 'user',
    });
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.token).toBeDefined();

    const storedUser = await User.findOne({ email: validUser.email });
    expect(storedUser).not.toBeNull();
    expect(storedUser?.password).not.toBe(validUser.password);
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/auth/register').send(validUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/already registered/i);
  });

  it('should reject missing required fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should reject password shorter than 6 characters', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/at least 6 characters/i);
  });

  it('should reject names containing numbers', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, name: 'Jane123' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/letters only/i);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(validUser.email);
    expect(response.body.data.token).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid email or password/i);
  });

  it('should reject non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should reject missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('GET /api/auth/me', () => {
  let token: string;

  beforeEach(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser);
    token = response.body.data.token;
  });

  it('should return the authenticated user', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(validUser.email);
    expect(response.body.data.user.password).toBeUndefined();
  });

  it('should reject requests without a token', async () => {
    const response = await request(app).get('/api/auth/me').expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/authentication required/i);
  });

  it('should reject invalid tokens', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should reject expired or tampered tokens', async () => {
    const tamperedToken = jwt.sign(
      { id: 'fake-id', email: validUser.email, role: 'user' },
      'wrong-secret',
    );

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tamperedToken}`)
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

describe('AuthMiddleware authorization', () => {
  it('should attach user role from a valid JWT', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    const { token } = registerResponse.body.data;

    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meResponse.body.data.user.role).toBe('user');

    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      role: string;
    };
    expect(decoded.role).toBe('user');
  });
});
