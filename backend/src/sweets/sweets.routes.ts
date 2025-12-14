import { Router } from 'express';
import { 
  getAllSweets, 
  getSweetById, 
  createSweet, 
  updateSweet, 
  deleteSweet 
} from './sweets.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', getAllSweets);
router.get('/:id', getSweetById);

// Admin only routes
router.post(
  '/', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  createSweet
);

router.put(
  '/:id', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  updateSweet
);

router.delete(
  '/:id', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  deleteSweet
);

export default router;
