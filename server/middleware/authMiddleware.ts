import type { NextFunction, Request, Response } from 'express';
import { readDb } from '../db/store.ts';
import type { StoredUser } from '../utils/auth.ts';

export interface AuthenticatedRequest extends Request {
  authToken?: string;
  currentUser?: StoredUser;
}

export function extractBearerToken(req: Request): string {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  const db = readDb();
  const userId = db.sessions[token];
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }

  req.authToken = token;
  req.currentUser = user;
  next();
}

export function apiErrorHandler(
  err: Error & { status?: number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) return;

  if (err instanceof SyntaxError && err.status === 400) {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }

  if (err.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request payload is too large.' });
    return;
  }

  console.error('API Error:', err.message);
  res.status(err.status && err.status >= 400 ? err.status : 500).json({
    error: err.status && err.status < 500 ? err.message : 'Internal server error.',
  });
}
