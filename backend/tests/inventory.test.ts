import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Inventory Management', () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: number;
  let userId: number;

  beforeAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'inventoryadmin@example.com',
        password: 'hashed_password',
        name: 'Inventory Admin',
        role: 'ADMIN'
      }
    });
    adminToken = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Create regular user
    const user = await prisma.user.create({
      data: {
        email: 'inventoryuser@example.com',
        password: 'hashed_password',
        name: 'Inventory User',
        role: 'USER'
      }
    });
    userId = user.id;
    userToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Create a test sweet with initial stock
    const sweet = await prisma.sweet.create({
      data: {
        name: 'Inventory Chocolate',
        description: 'For inventory testing',
        price: 4.99,
        stock: 50  // Initial stock
      }
    });
    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/inventory/purchase', () => {
    it('should allow user to purchase sweets', async () => {
      const purchaseData = {
        sweetId,
        quantity: 3
      };

      const response = await request(app)
        .post('/api/inventory/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Purchase successful');
      expect(response.body).toHaveProperty('remainingStock');
      expect(response.body.remainingStock).toBe(47); // 50 - 3
    });

    it('should not allow purchase with insufficient stock', async () => {
      const purchaseData = {
        sweetId,
        quantity: 1000  // More than available
      };

      const response = await request(app)
        .post('/api/inventory/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Insufficient stock');
    });

    it('should require authentication for purchase', async () => {
      const response = await request(app)
        .post('/api/inventory/purchase')
        .send({ sweetId, quantity: 1 });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/inventory/restock (Admin only)', () => {
    it('should allow admin to restock sweets', async () => {
      const restockData = {
        sweetId,
        quantity: 25
      };

      const response = await request(app)
        .post('/api/inventory/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Restock successful');
      expect(response.body).toHaveProperty('newStock');
      // Should be 47 (after purchase) + 25 = 72
      expect(response.body.newStock).toBe(72);
    });

    it('should not allow non-admin to restock', async () => {
      const response = await request(app)
        .post('/api/inventory/restock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ sweetId, quantity: 10 });

      expect(response.status).toBe(403);
    });

    it('should handle non-existent sweet', async () => {
      const response = await request(app)
        .post('/api/inventory/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sweetId: 99999, quantity: 10 });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/inventory/low-stock', () => {
    it('should return sweets with low stock (Admin only)', async () => {
      // Create a low-stock sweet
      await prisma.sweet.create({
        data: {
          name: 'Low Stock Candy',
          description: 'Almost out',
          price: 1.99,
          stock: 3  // Low stock
        }
      });

      const response = await request(app)
        .get('/api/inventory/low-stock')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should include the low stock sweet
      expect(response.body.some((s: any) => s.stock <= 10)).toBe(true);
    });

    it('should not allow non-admin to view low stock', async () => {
      const response = await request(app)
        .get('/api/inventory/low-stock')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
