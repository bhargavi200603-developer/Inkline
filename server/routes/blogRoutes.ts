import crypto from 'crypto';
import { Router } from 'express';
import { BLOG_CATEGORIES, computeReadingMetrics } from '../../src/data/sampleBlogs.ts';
import type { BlogCategory, BlogPost } from '../../src/types/blog.ts';
import { readDb, writeDb } from '../db/store.ts';

const blogRouter = Router();
const DEFAULT_COVER_IMAGE =
  '/src/assets/images/blog_cover_architecture_1795093229011.jpg';

function formatPublishedDate(date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function isValidCoverUrl(url: string): boolean {
  return (
    url.startsWith('/') ||
    url.startsWith('https://') ||
    url.startsWith('http://')
  );
}

// GET /api/blogs - List all published blogs
blogRouter.get('/', (_req, res, next) => {
  try {
    const db = readDb();
    res.json({ blogs: db.blogs });
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/:id - Fetch a single blog by ID
blogRouter.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) {
      res.status(404).json({ error: 'Blog post not found.' });
      return;
    }
    res.json({ blog });
  } catch (err) {
    next(err);
  }
});

// POST /api/blogs - Create and publish a new blog post
blogRouter.post('/', (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a JSON object.' });
      return;
    }

    const cleanTitle = typeof body.title === 'string' ? body.title.trim() : '';
    const cleanDescription =
      typeof body.description === 'string' ? body.description.trim() : '';
    const cleanContent =
      typeof body.content === 'string' ? body.content.trim() : '';
    const rawCategory =
      typeof body.category === 'string' ? body.category.trim() : 'Engineering';
    const rawCover =
      typeof body.coverImage === 'string' ? body.coverImage.trim() : '';
    const rawAuthorName =
      typeof body.authorName === 'string' ? body.authorName.trim() : '';
    const rawAuthorEmail =
      typeof body.authorEmail === 'string'
        ? body.authorEmail.trim().toLowerCase()
        : '';

    if (cleanTitle.length < 4 || cleanTitle.length > 160) {
      res.status(400).json({
        error: 'Blog title must be between 4 and 160 characters.',
      });
      return;
    }
    if (cleanDescription.length < 10 || cleanDescription.length > 400) {
      res.status(400).json({
        error: 'Short description must be between 10 and 400 characters.',
      });
      return;
    }
    if (cleanContent.length < 20) {
      res.status(400).json({
        error: 'Blog content must be at least 20 characters.',
      });
      return;
    }

    if (!BLOG_CATEGORIES.includes(rawCategory as BlogCategory)) {
      res.status(400).json({
        error: `Category must be one of: ${BLOG_CATEGORIES.join(', ')}.`,
      });
      return;
    }

    if (rawCover && !isValidCoverUrl(rawCover)) {
      res.status(400).json({
        error: 'Cover image must be a relative path or an http/https URL.',
      });
      return;
    }

    const metrics = computeReadingMetrics(cleanContent);
    const newBlog: BlogPost = {
      id: `blog-${crypto.randomUUID().slice(0, 8)}`,
      title: cleanTitle,
      description: cleanDescription,
      content: cleanContent,
      category: rawCategory as BlogCategory,
      coverImage: rawCover || DEFAULT_COVER_IMAGE,
      authorName: rawAuthorName || 'Guest Writer',
      authorEmail: rawAuthorEmail || 'guest@inkline.dev',
      publishedAt: formatPublishedDate(),
      ...metrics,
    };

    const db = readDb();
    db.blogs.unshift(newBlog);
    writeDb(db);

    res.status(201).json({ blog: newBlog });
  } catch (err) {
    next(err);
  }
});

// PUT /api/blogs/:id - Update an existing blog post
blogRouter.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a JSON object.' });
      return;
    }

    const db = readDb();
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Blog post not found.' });
      return;
    }

    const existing = db.blogs[index];
    const cleanTitle = typeof body.title === 'string' ? body.title.trim() : '';
    const cleanDescription =
      typeof body.description === 'string' ? body.description.trim() : '';
    const cleanContent =
      typeof body.content === 'string' ? body.content.trim() : '';
    const rawCategory =
      typeof body.category === 'string' ? body.category.trim() : existing.category;
    const rawCover =
      typeof body.coverImage === 'string'
        ? body.coverImage.trim()
        : existing.coverImage;

    if (cleanTitle.length < 4 || cleanTitle.length > 160) {
      res.status(400).json({
        error: 'Blog title must be between 4 and 160 characters.',
      });
      return;
    }
    if (cleanDescription.length < 10 || cleanDescription.length > 400) {
      res.status(400).json({
        error: 'Short description must be between 10 and 400 characters.',
      });
      return;
    }
    if (cleanContent.length < 20) {
      res.status(400).json({
        error: 'Blog content must be at least 20 characters.',
      });
      return;
    }
    if (!BLOG_CATEGORIES.includes(rawCategory as BlogCategory)) {
      res.status(400).json({
        error: `Category must be one of: ${BLOG_CATEGORIES.join(', ')}.`,
      });
      return;
    }
    if (rawCover && !isValidCoverUrl(rawCover)) {
      res.status(400).json({
        error: 'Cover image must be a relative path or an http/https URL.',
      });
      return;
    }

    const metrics = computeReadingMetrics(cleanContent);
    const updated: BlogPost = {
      ...existing,
      title: cleanTitle,
      description: cleanDescription,
      content: cleanContent,
      category: rawCategory as BlogCategory,
      coverImage: rawCover || existing.coverImage,
      ...metrics,
    };

    db.blogs[index] = updated;
    writeDb(db);

    res.json({ blog: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/blogs/:id - Remove a blog post
blogRouter.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const exists = db.blogs.some((b) => b.id === id);
    if (!exists) {
      res.status(404).json({ error: 'Blog post not found.' });
      return;
    }

    db.blogs = db.blogs.filter((b) => b.id !== id);
    writeDb(db);

    res.json({ deletedId: id });
  } catch (err) {
    next(err);
  }
});

export default blogRouter;
