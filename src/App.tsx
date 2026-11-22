import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ArticlePage from './pages/ArticlePage';
import CreateBlogPage from './pages/CreateBlogPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {
  createBlog,
  deleteBlog,
  fetchBlogs,
  getSavedSession,
  logoutUser,
  saveSession,
  updateBlog,
  verifySession,
} from './services/api';
import type {
  AuthResponse,
  BlogCategory,
  BlogPost,
  PageRoute,
  User,
} from './types/blog';

function parseHashRoute(hash: string): {
  page: PageRoute;
  blogId: string | null;
  editId: string | null;
} {
  const cleaned = hash.replace(/^#\/?/, '');
  if (cleaned === 'login') return { page: 'login', blogId: null, editId: null };
  if (cleaned === 'register') return { page: 'register', blogId: null, editId: null };
  if (cleaned === 'dashboard') return { page: 'dashboard', blogId: null, editId: null };
  if (cleaned === 'create') return { page: 'create', blogId: null, editId: null };
  if (cleaned.startsWith('article/')) {
    return {
      page: 'article',
      blogId: decodeURIComponent(cleaned.slice('article/'.length)),
      editId: null,
    };
  }
  if (cleaned.startsWith('edit/')) {
    return {
      page: 'create',
      blogId: null,
      editId: decodeURIComponent(cleaned.slice('edit/'.length)),
    };
  }
  return { page: 'home', blogId: null, editId: null };
}

export default function App() {
  const initialRoute = parseHashRoute(window.location.hash);
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(
    initialRoute.blogId
  );
  const [editingBlogId, setEditingBlogId] = useState<string | null>(
    initialRoute.editId
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getSavedSession()?.user ?? null;
  });
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashRoute(window.location.hash);
      setCurrentPage(parsed.page);
      setSelectedBlogId(parsed.blogId);
      setEditingBlogId(parsed.editId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const [loadedBlogs, saved] = await Promise.all([
        fetchBlogs(),
        Promise.resolve(getSavedSession()),
      ]);

      if (!active) return;
      setBlogs(loadedBlogs);
      setIsLoadingBlogs(false);

      if (saved?.token) {
        const verifiedUser = await verifySession(saved.token);
        if (!active) return;
        if (verifiedUser) {
          setCurrentUser(verifiedUser);
        } else {
          saveSession(null);
          setCurrentUser(null);
        }
      }
    }

    initialize();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const navigateTo = (page: PageRoute) => {
    if (page !== 'create') {
      setEditingBlogId(null);
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '#home' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setCurrentPage('article');
    window.location.hash = `#article/${encodeURIComponent(blogId)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBlog = (blogId: string) => {
    setEditingBlogId(blogId);
    setCurrentPage('create');
    window.location.hash = `#edit/${encodeURIComponent(blogId)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (session: AuthResponse) => {
    setCurrentUser(session.user);
    setNotice(`Signed in as ${session.user.name}.`);
    navigateTo('dashboard');
  };

  const handleRegisterSuccess = (session: AuthResponse) => {
    setCurrentUser(session.user);
    setNotice(`Account created! Welcome to Inkline, ${session.user.name}.`);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    void logoutUser();
    setCurrentUser(null);
    setNotice('You have been signed out.');
    navigateTo('home');
  };

  const handlePublishBlog = async (payload: {
    title: string;
    description: string;
    content: string;
    category: BlogCategory;
    coverImage: string;
    authorName: string;
    authorEmail: string;
  }) => {
    const created = await createBlog(payload);
    setBlogs((prev) => [created, ...prev]);
    setNotice(`Published "${created.title}".`);
    navigateTo('dashboard');
  };

  const handleUpdateBlog = async (
    id: string,
    payload: {
      title: string;
      description: string;
      content: string;
      category: BlogCategory;
      coverImage: string;
    }
  ) => {
    const updated = await updateBlog(id, payload);
    setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setEditingBlogId(null);
    setNotice(`Updated "${updated.title}".`);
    navigateTo('dashboard');
  };

  const handleDeleteBlog = async (id: string) => {
    await deleteBlog(id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    setNotice('Blog post removed.');
  };

  const selectedBlog = blogs.find((b) => b.id === selectedBlogId) ?? null;
  const editingBlog = blogs.find((b) => b.id === editingBlogId) ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900">
      <Navbar
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {notice && (
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            role="status"
            className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notification"
              className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            blogs={blogs}
            isLoading={isLoadingBlogs}
            onSelectBlog={handleSelectBlog}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'article' && (
          <ArticlePage
            blog={selectedBlog}
            isLoading={isLoadingBlogs}
            onNavigate={navigateTo}
            onEditBlog={handleEditBlog}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage onSuccess={handleLoginSuccess} onNavigate={navigateTo} />
        )}

        {currentPage === 'register' && (
          <RegisterPage onSuccess={handleRegisterSuccess} onNavigate={navigateTo} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            blogs={blogs}
            currentUser={currentUser}
            onNavigate={navigateTo}
            onViewBlog={handleSelectBlog}
            onEditBlog={handleEditBlog}
            onDeleteBlog={handleDeleteBlog}
          />
        )}

        {currentPage === 'create' && (
          <CreateBlogPage
            key={editingBlog?.id ?? 'new'}
            currentUser={currentUser}
            editingBlog={editingBlog}
            onPublish={handlePublishBlog}
            onUpdate={handleUpdateBlog}
            onNavigate={navigateTo}
          />
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-zinc-900">
              Inkline
            </span>
            <span aria-hidden="true">·</span>
            <span>Full Stack Blog Application</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigateTo('create')}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Create Blog
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
