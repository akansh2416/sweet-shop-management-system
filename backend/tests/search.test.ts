import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Search Functionality', () => {
  beforeAll(async () => {
    await prisma.sweet.deleteMany();

    // Create test sweets
    await prisma.sweet.createMany({
      data: [
        {
          name: 'Chocolate Bar',
          description: 'Milk chocolate bar',
          price: 2.99,
          stock: 50
        },
        {
          name: 'Dark Chocolate',
          description: 'Rich dark chocolate',
          price: 3.99,
          stock: 30
        },
        {
          name: 'Gummy Bears',
          description: 'Fruity gummy candies',
          price: 1.99,
          stock: 100
        },
        {
          name: 'Caramel Candy',
          description: 'Soft caramel sweets',
          price: 2.50,
          stock: 25
        },
        {
          name: 'Mint Chocolate',
          description: 'Chocolate with mint flavor',
          price: 3.50,
          stock: 40
        }
      ]
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ q: 'chocolate' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3); // Chocolate Bar, Dark Chocolate, Mint Chocolate
      expect(response.body.data[0]).toHaveProperty('name');
    });

    it('should search sweets by description', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ q: 'fruity' });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Gummy Bears');
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ q: 'nonexistent' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return all sweets when no query provided', async () => {
      const response = await request(app)
        .get('/api/sweets/search');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ 
          q: 'chocolate',
          page: '1',
          limit: '2'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('total', 3);
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('totalPages', 2);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ 
          minPrice: '3.00',
          maxPrice: '4.00'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2); // Dark Chocolate (3.99) and Mint Chocolate (3.50)
      response.body.data.forEach((sweet: any) => {
        expect(sweet.price).toBeGreaterThanOrEqual(3.00);
        expect(sweet.price).toBeLessThanOrEqual(4.00);
      });
    });

    it('should filter by stock availability', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ 
          inStock: 'true'
        });

      expect(response.status).toBe(200);
      response.body.data.forEach((sweet: any) => {
        expect(sweet.stock).toBeGreaterThan(0);
      });
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ 
          q: 'chocolate',
          minPrice: '3.00',
          inStock: 'true'
        });

      expect(response.status).toBe(200);
      response.body.data.forEach((sweet: any) => {
        expect(sweet.name.toLowerCase()).toContain('chocolate');
        expect(sweet.price).toBeGreaterThanOrEqual(3.00);
        expect(sweet.stock).toBeGreaterThan(0);
      });
    });
  });
});
