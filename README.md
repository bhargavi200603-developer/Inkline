# Inkline — Full Stack Blog Application

A beginner-friendly, responsive Full Stack Blog Application built for a Full Stack Web Development Internship project using React, Tailwind CSS, Node.js, and Express.js.

## Features & Pages

1. **Home Page (`#home`)** — Displays a featured article, category filter tabs, search bar, and responsive grid of published blog cards with titles, cover images, and descriptions. Clicking any card opens the full **Article Reader**.
2. **Login Page (`#login`)** — Allows users to sign in with email and password, toggle password visibility, and optionally autofill the pre-seeded demo account (`alex@inkline.dev` / `password123`).
3. **Register Page (`#register`)** — Allows new users to register with Full Name, Email, Password, and Confirm Password, automatically signing them in.
4. **Dashboard (`#dashboard`)** — Displays the signed-in user's blog posts (or all published posts), summary metrics (post count, word count, reading time), search, and **View**, **Edit**, and **Delete** controls.
5. **Create Blog Page (`#create`)** — Allows users to write, edit, select a category and cover image, preview live word/reading-time counts, and publish blog posts.

## Project File Structure

```
├── server.ts                          # Express.js entry point + Vite middleware
├── server/
│   ├── db/
│   │   └── store.ts                   # JSON database persistence (data/blog-db.json)
│   ├── middleware/
│   │   └── authMiddleware.ts          # Bearer token auth & error handler middleware
│   ├── routes/
│   │   ├── authRoutes.ts              # /api/auth/* routes (register, login, logout, me)
│   │   └── blogRoutes.ts              # /api/blogs/* CRUD routes
│   └── utils/
│       └── auth.ts                    # scrypt password hashing & user sanitizer
├── index.html                         # HTML entry point & Google Fonts
├── src/
│   ├── main.tsx                       # React DOM entry point
│   ├── index.css                      # Tailwind CSS v4 theme & typography rules
│   ├── App.tsx                        # Hash-based router, auth state, and blog CRUD handlers
│   ├── types/blog.ts                  # TypeScript interfaces for posts, users, and routes
│   ├── data/sampleBlogs.ts            # Initial 5 sample blog posts and cover presets
│   ├── services/api.ts                # Frontend fetch client + localStorage session sync
│   ├── components/
│   │   ├── Navbar.tsx                 # Responsive top navigation bar & mobile menu drawer
│   │   └── BlogCoverImage.tsx         # Cover image component with fallback state
│   └── pages/
│       ├── HomePage.tsx               # Home feed with featured post, filters, and blog cards
│       ├── ArticlePage.tsx            # Full article reading view
│       ├── LoginPage.tsx              # Email & password sign-in page
│       ├── RegisterPage.tsx           # New user registration page
│       ├── DashboardPage.tsx          # User blog management dashboard
│       └── CreateBlogPage.tsx         # Create & edit blog post composer
```

## Backend API Endpoints

- `GET /api/health` — Server health check
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Authenticate user and issue session token
- `POST /api/auth/logout` — Revoke current session token
- `GET /api/auth/me` — Verify Bearer token and return current user
- `GET /api/blogs` — Fetch all published blog posts
- `GET /api/blogs/:id` — Fetch a single blog post by ID
- `POST /api/blogs` — Create and publish a new blog post
- `PUT /api/blogs/:id` — Update an existing blog post
- `DELETE /api/blogs/:id` — Delete a blog post

## How to Run & Test

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the Express + Vite server** (runs on port `3000`):
   ```bash
   npm run dev
   ```
3. **Production build & run**:
   ```bash
   npm run build
   NODE_ENV=production npx tsx server.ts
   ```
4. **Open in browser (Desktop or Android phone)**:
   Visit `http://localhost:3000` (or your AI Studio preview URL).
5. **Test the full workflow**:
   - Browse the 5 pre-loaded sample articles on the **Home** page and open any article to read it.
   - Open **Register** to create a new account (or open **Login** and click **Use Demo Account** for `alex@inkline.dev` / `password123`).
   - Open **Create Blog**, enter a title, short description, and article content, and click **Publish Blog**.
   - Check the **Dashboard** to view, edit, or delete your published blog posts, and confirm changes reflect immediately on **Home**.
