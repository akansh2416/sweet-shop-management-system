import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';
import protectedRoutes from './protected/protected.routes';
import sweetsRoutes from './sweets/sweets.routes';
import inventoryRoutes from './inventory/inventory.routes';

// backend/src/app.ts - Add this after imports




const app = express();

// Allow ALL origins for testing (remove in production)

// Add CORS middleware
app.use(cors({
  origin: [
     'http://localhost:5173',  // Local development
    'https://sweet-shop-management-system-cwh500m9k-akansh2416s-projects.vercel.app',  // Your current Vercel
    'https://sweet-shop-management-system.vercel.app',  // Your main domain
    'https://*.vercel.app'  // Any Vercel subdomain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use('/api/inventory', inventoryRoutes);

export default app;
