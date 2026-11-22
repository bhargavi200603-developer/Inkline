import { INITIAL_SAMPLE_BLOGS, computeReadingMetrics } from '../data/sampleBlogs';
import type { AuthResponse, BlogCategory, BlogPost, User } from '../types/blog';

const STORAGE_BLOGS_KEY = 'inkline_blogs_v1';
const STORAGE_AUTH_KEY = 'inkline_auth_v1';

// Uses same-origin Express backend by default; supports VITE_API_URL override if hosted separately
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

async function parseApiJson<T>(res: Response): Promise<T & { error?: string }> {
  const text = await res.text();
  if (!text) {
    return {} as T & { error?: string };
  }
  try {
    return JSON.parse(text) as T & { error?: string };
  } catch {
    throw new Error(
      res.ok
        ? 'Received an unexpected response from the server.'
        : `Server error (${res.status}). Please try again.`
    );
  }
}

export function getSavedSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthResponse | null): void {
  try {
    if (session) {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

function getLocalBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_BLOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BlogPost[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to seed
  }
  return INITIAL_SAMPLE_BLOGS;
}

function saveLocalBlogs(blogs: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_BLOGS_KEY, JSON.stringify(blogs));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(apiUrl('/api/blogs'));
    if (!res.ok) throw new Error('Failed to load blogs');
    const data = await parseApiJson<{ blogs: BlogPost[] }>(res);
    if (!Array.isArray(data.blogs)) throw new Error('Invalid blog list response');
    saveLocalBlogs(data.blogs);
    return data.blogs;
  } catch {
    return getLocalBlogs();
  }
}

export async function createBlog(payload: {
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  coverImage: string;
  authorName: string;
  authorEmail: string;
}): Promise<BlogPost> {
  const res = await fetch(apiUrl('/api/blogs'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseApiJson<{ blog?: BlogPost }>(res);
  if (!res.ok || !data.blog) {
    throw new Error(data.error || 'Could not publish blog post.');
  }

  const current = getLocalBlogs();
  saveLocalBlogs([data.blog, ...current]);
  return data.blog;
}

export async function updateBlog(
  id: string,
  payload: {
    title: string;
    description: string;
    content: string;
    category: BlogCategory;
    coverImage: string;
  }
): Promise<BlogPost> {
  const res = await fetch(apiUrl(`/api/blogs/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseApiJson<{ blog?: BlogPost }>(res);
  if (!res.ok || !data.blog) {
    throw new Error(data.error || 'Could not update blog post.');
  }

  const updatedBlog = data.blog;
  const current = getLocalBlogs().map((b) => (b.id === id ? updatedBlog : b));
  saveLocalBlogs(current);
  return updatedBlog;
}

export async function deleteBlog(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/blogs/${encodeURIComponent(id)}`), {
    method: 'DELETE',
  });

  const data = await parseApiJson<{ deletedId?: string }>(res);
  if (!res.ok) {
    throw new Error(data.error || 'Could not delete blog post.');
  }

  const current = getLocalBlogs().filter((b) => b.id !== id);
  saveLocalBlogs(current);
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseApiJson<Partial<AuthResponse>>(res);
  if (!res.ok || !data.token || !data.user) {
    throw new Error(data.error || 'Login failed.');
  }

  const session: AuthResponse = { token: data.token, user: data.user };
  saveSession(session);
  return session;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseApiJson<Partial<AuthResponse>>(res);
  if (!res.ok || !data.token || !data.user) {
    throw new Error(data.error || 'Registration failed.');
  }

  const session: AuthResponse = { token: data.token, user: data.user };
  saveSession(session);
  return session;
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const res = await fetch(apiUrl('/api/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await parseApiJson<{ user?: User }>(res);
    return data.user || null;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const session = getSavedSession();
  saveSession(null);
  if (!session?.token) return;
  try {
    await fetch(apiUrl('/api/auth/logout'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
    });
  } catch {
    // Ignore network errors on sign out
  }
}

export { computeReadingMetrics };
