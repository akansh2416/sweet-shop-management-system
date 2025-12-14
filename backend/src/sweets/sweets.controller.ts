import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get all sweets
export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await prisma.sweet.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single sweet
export const getSweetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sweet = await prisma.sweet.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create sweet (Admin only)
export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;

    // Check if sweet already exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { name }
    });

    if (existingSweet) {
      return res.status(400).json({ error: 'Sweet with this name already exists' });
    }

    const sweet = await prisma.sweet.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0
      }
    });

    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update sweet (Admin only)
export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const sweet = await prisma.sweet.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Check if new name conflicts with other sweet
    if (name && name !== sweet.name) {
      const existingSweet = await prisma.sweet.findUnique({
        where: { name }
      });

      if (existingSweet) {
        return res.status(400).json({ error: 'Sweet with this name already exists' });
      }
    }

    const updatedSweet = await prisma.sweet.update({
      where: { id: parseInt(id) },
      data: {
        name: name || sweet.name,
        description: description !== undefined ? description : sweet.description,
        price: price !== undefined ? parseFloat(price) : sweet.price,
        stock: stock !== undefined ? parseInt(stock) : sweet.stock
      }
    });

    res.json(updatedSweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete sweet (Admin only)
export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const sweet = await prisma.sweet.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    await prisma.sweet.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
