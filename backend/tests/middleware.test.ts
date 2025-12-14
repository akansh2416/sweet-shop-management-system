import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('JWT Middleware', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    
    // Create a test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'protected@example.com',
        password: 'hashed_password',
        name: 'Protected User',
        role: 'USER'
      }
    });

    userId = user.id;
    authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow access with valid token', async () => {
    const response = await request(app)
      .get('/api/protected/test')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Protected route accessed');
  });

  it('should deny access without token', async () => {
    const response = await request(app)
      .get('/api/protected/test');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/api/protected/test')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
