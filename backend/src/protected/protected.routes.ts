import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Test protected route
router.get('/test', authenticateToken, (req: AuthRequest, res) => {
  res.json({ 
    message: 'Protected route accessed',
    user: req.user 
  });
});

export default router;
