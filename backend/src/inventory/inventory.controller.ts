import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const LOW_STOCK_THRESHOLD = 10;

// Purchase sweets
export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { sweetId, quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!sweetId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid purchase data' });
    }

    // Find the sweet
    const sweet = await prisma.sweet.findUnique({
      where: { id: parseInt(sweetId) }
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Check stock
    if (sweet.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update stock (transaction for safety)
    const updatedSweet = await prisma.$transaction(async (tx) => {
      // Reduce stock
      return await tx.sweet.update({
        where: { id: parseInt(sweetId) },
        data: { 
          stock: { decrement: quantity }
        }
      });
    });

    // In a real app, you would also create a purchase record here
    // await prisma.purchase.create({
    //   data: {
    //     userId,
    //     sweetId: parseInt(sweetId),
    //     quantity,
    //     totalPrice: sweet.price * quantity
    //   }
    // });

    res.json({
      message: 'Purchase successful',
      purchasedQuantity: quantity,
      remainingStock: updatedSweet.stock,
      sweetName: sweet.name
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Restock sweets (Admin only)
export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { sweetId, quantity } = req.body;

    if (!sweetId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid restock data' });
    }

    // Find the sweet
    const sweet = await prisma.sweet.findUnique({
      where: { id: parseInt(sweetId) }
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Update stock
    const updatedSweet = await prisma.sweet.update({
      where: { id: parseInt(sweetId) },
      data: { 
        stock: { increment: quantity }
      }
    });

    res.json({
      message: 'Restock successful',
      addedQuantity: quantity,
      newStock: updatedSweet.stock,
      sweetName: sweet.name
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get low stock items (Admin only)
export const getLowStock = async (req: AuthRequest, res: Response) => {
  try {
    const lowStockSweets = await prisma.sweet.findMany({
      where: {
        stock: {
          lte: LOW_STOCK_THRESHOLD
        }
      },
      orderBy: { stock: 'asc' }
    });

    res.json(lowStockSweets);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
