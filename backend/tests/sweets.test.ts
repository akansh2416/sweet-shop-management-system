import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Sweets CRUD', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: number;
  let userId: number;
  let sweetId: number;

  beforeAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'hashed_password',
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
    adminId = admin.id;
    adminToken = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Create regular user
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: 'hashed_password',
        name: 'Regular User',
        role: 'USER'
      }
    });
    userId = user.id;
    userToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Create a test sweet
    const sweet = await prisma.sweet.create({
      data: {
        name: 'Test Chocolate',
        description: 'Delicious chocolate',
        price: 5.99,
        stock: 100
      }
    });
    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets (public)', async () => {
      const response = await request(app).get('/api/sweets');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get single sweet by ID', async () => {
      const response = await request(app).get(`/api/sweets/${sweetId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Chocolate');
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app).get('/api/sweets/99999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create new sweet as admin', async () => {
      const newSweet = {
        name: 'New Candy',
        description: 'Sweet candy',
        price: 2.50,
        stock: 50
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSweet);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newSweet.name);
    });

    it('should not create sweet without admin role', async () => {
      const newSweet = {
        name: 'User Candy',
        description: 'User trying to create',
        price: 1.99,
        stock: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newSweet);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/sweets/:id (Admin only)', () => {
    it('should update sweet as admin', async () => {
      const updateData = {
        name: 'Updated Chocolate',
        price: 6.99,
        stock: 150
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });
  });

  describe('DELETE /api/sweets/:id (Admin only)', () => {
    it('should delete sweet as admin', async () => {
      // First create a sweet to delete
      const sweetToDelete = await prisma.sweet.create({
        data: {
          name: 'To Delete',
          description: 'Will be deleted',
          price: 1.00,
          stock: 10
        }
      });

      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      // Verify it's deleted
      const deletedSweet = await prisma.sweet.findUnique({
        where: { id: sweetToDelete.id }
      });
      expect(deletedSweet).toBeNull();
    });
  });
});
