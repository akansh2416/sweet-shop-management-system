import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';
import protectedRoutes from './protected/protected.routes';
import sweetsRoutes from './sweets/sweets.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/sweets', sweetsRoutes);

export default app;
