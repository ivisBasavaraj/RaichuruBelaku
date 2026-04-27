import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './src/server/db';
import { authRouter } from './src/server/auth';
import { adminRouter } from './src/server/admin';
import { userRouter } from './src/server/user';
import { DATA_DIR, UPLOAD_ROOT, ensureDataDirectories } from './src/server/paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Ensure data and uploads directories exist
  ensureDataDirectories();
  console.log('Using data directory:', DATA_DIR);

  app.use(express.json());

  // Initialize Database
  initDb();

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/user', userRouter);

  // Serve uploaded files from data/uploads
  app.use(
    '/uploads',
    (req, res, next) => {
      console.log(`Serving upload: ${req.url}`);
      next();
    },
    express.static(UPLOAD_ROOT, { fallthrough: false })
  );

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Global error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving (simplified for this environment)
    app.use(express.static(path.join(__dirname, 'dist')));
    
    // Catch-all route to serve index.html for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
