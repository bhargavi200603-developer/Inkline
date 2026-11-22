import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SAMPLE_BLOGS } from '../../src/data/sampleBlogs.ts';
import type { BlogPost } from '../../src/types/blog.ts';
import { hashPassword, type StoredUser } from '../utils/auth.ts';

export interface DatabaseSchema {
  users: StoredUser[];
  blogs: BlogPost[];
  sessions: Record<string, string>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_PATH = path.join(DATA_DIR, 'blog-db.json');

export function createInitialDb(): DatabaseSchema {
  const demoUser: StoredUser = {
    id: 'user-demo-1',
    name: 'Alex Rivera',
    email: 'alex@inkline.dev',
    role: 'Editorial Intern',
    joinedAt: 'Oct 2026',
    passwordHash: hashPassword('password123'),
  };

  return {
    users: [demoUser],
    blogs: INITIAL_SAMPLE_BLOGS,
    sessions: {},
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const seed = createInitialDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!Array.isArray(parsed.blogs) || !Array.isArray(parsed.users)) {
      const seed = createInitialDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    return {
      users: parsed.users,
      blogs: parsed.blogs,
      sessions: parsed.sessions || {},
    };
  } catch {
    return createInitialDb();
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
