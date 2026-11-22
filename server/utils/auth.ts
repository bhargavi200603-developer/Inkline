import crypto from 'crypto';
import type { User } from '../../src/types/blog.ts';

export interface StoredUser extends User {
  passwordHash: string;
}

export function hashPassword(password: string, salt?: string): string {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, usedSalt, 64).toString('hex');
  return `${usedSalt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');
  if (derived.length !== keyBuffer.length) return false;
  return crypto.timingSafeEqual(derived, keyBuffer);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function sanitizeUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    joinedAt: user.joinedAt,
  };
}
