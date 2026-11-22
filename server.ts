import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { readDb } from './server/db/store.ts';
import { apiErrorHandler } from './server/middleware/authMiddleware.ts';
import authRouter from './server/routes/authRoutes.ts';
import blogRouter from './server/routes/blogRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Ensure initial sample database exists on startup
  readDb();

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'inkline-api' });
  });

  // Modular API routes
  app.use('/api/auth', authRouter);
  app.use('/api/blogs', blogRouter);

  // Return JSON 404 for unknown API endpoints
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // Central Express error handler
  app.use(apiErrorHandler);

  // Mount Vite middleware in development, static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inkline blog server running on http://localhost:${PORT}`);
  });
}

startServer();
