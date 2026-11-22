import crypto from 'crypto';
import { Router } from 'express';
import { readDb, writeDb } from '../db/store.ts';
import {
  extractBearerToken,
  requireAuth,
  type AuthenticatedRequest,
} from '../middleware/authMiddleware.ts';
import {
  generateSessionToken,
  hashPassword,
  sanitizeUser,
  verifyPassword,
  type StoredUser,
} from '../utils/auth.ts';

const authRouter = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register - Register a new user
authRouter.post('/register', (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a JSON object.' });
      return;
    }

    const rawName = typeof body.name === 'string' ? body.name : '';
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const rawPassword = typeof body.password === 'string' ? body.password : '';

    const trimmedName = rawName.trim();
    const normalizedEmail = rawEmail.trim().toLowerCase();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      res.status(400).json({
        error: 'Full name must be between 2 and 80 characters.',
      });
      return;
    }

    if (
      !normalizedEmail ||
      normalizedEmail.length > 254 ||
      !EMAIL_REGEX.test(normalizedEmail)
    ) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (rawPassword.length < 6 || rawPassword.length > 128) {
      res.status(400).json({
        error: 'Password must be between 6 and 128 characters long.',
      });
      return;
    }

    const db = readDb();
    const exists = db.users.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      res
        .status(409)
        .json({ error: 'An account with this email already exists.' });
      return;
    }

    const newUser: StoredUser = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name: trimmedName,
      email: normalizedEmail,
      role: 'Author',
      joinedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      passwordHash: hashPassword(rawPassword),
    };

    const token = generateSessionToken();
    db.users.push(newUser);
    db.sessions[token] = newUser.id;
    writeDb(db);

    res.status(201).json({ token, user: sanitizeUser(newUser) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - Authenticate an existing user
authRouter.post('/login', (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a JSON object.' });
      return;
    }

    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const rawPassword = typeof body.password === 'string' ? body.password : '';

    const normalizedEmail = rawEmail.trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (!rawPassword) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    const db = readDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (!user || !verifyPassword(rawPassword, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = generateSessionToken();
    db.sessions[token] = user.id;
    writeDb(db);

    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout - Revoke active session token
authRouter.post('/logout', (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (token) {
      const db = readDb();
      if (db.sessions[token]) {
        delete db.sessions[token];
        writeDb(db);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Return authenticated user profile
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.currentUser) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user: sanitizeUser(req.currentUser) });
});

export default authRouter;
