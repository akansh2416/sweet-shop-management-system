import { Router } from 'express';
import { 
  purchaseSweet, 
  restockSweet, 
  getLowStock 
} from './inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Purchase - authenticated users only
router.post(
  '/purchase',
  authenticateToken,
  purchaseSweet
);

// Restock - admin only
router.post(
  '/restock',
  authenticateToken,
  requireRole(['ADMIN']),
  restockSweet
);

// Low stock report - admin only
router.get(
  '/low-stock',
  authenticateToken,
  requireRole(['ADMIN']),
  getLowStock
);

export default router;
