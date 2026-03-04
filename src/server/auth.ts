import { Router } from 'express';
import { db } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Admin login only
authRouter.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded admin credentials for simplicity
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign({ id: 'admin', role: 'admin', name: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: 'admin', email, role: 'admin', name: 'Admin' } });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});
