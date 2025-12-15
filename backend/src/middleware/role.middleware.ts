import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

// export const requireRole = (roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Insufficient permissions' });
//     }

//     next();
//   };
// };
// In role.middleware.ts, modify:
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // TEMPORARY: Allow admin@example.com regardless of token role
    if (req.user.email === 'admin@example.com') {
      console.log('Bypassing role check for admin@example.com');
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};