import { Edit3, ExternalLink, PenSquare, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import BlogCoverImage from '../components/BlogCoverImage';
import type { BlogPost, PageRoute, User } from '../types/blog';

interface DashboardPageProps {
  blogs: BlogPost[];
  currentUser: User | null;
  onNavigate: (page: PageRoute) => void;
  onViewBlog: (blogId: string) => void;
  onEditBlog: (blogId: string) => void;
  onDeleteBlog: (blogId: string) => Promise<void>;
}

export default function DashboardPage({
  blogs,
  currentUser,
  onNavigate,
  onViewBlog,
  onEditBlog,
  onDeleteBlog,
}: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScope, setFilterScope] = useState<'all' | 'mine'>(
    currentUser ? 'mine' : 'all'
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myBlogsCount = useMemo(() => {
    if (!currentUser) return 0;
    return blogs.filter(
      (b) => b.authorEmail.toLowerCase() === currentUser.email.toLowerCase()
    ).length;
  }, [blogs, currentUser]);

  const activeScope = currentUser ? filterScope : 'all';

  const visibleBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesScope =
        activeScope === 'all' ||
        (currentUser &&
          blog.authorEmail.toLowerCase() === currentUser.email.toLowerCase());
      const matchesQuery =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        blog.authorName.toLowerCase().includes(q);
      return matchesScope && matchesQuery;
    });
  }, [blogs, activeScope, currentUser, searchQuery]);

  const stats = useMemo(() => {
    const totalPosts = visibleBlogs.length;
    const totalWords = visibleBlogs.reduce((sum, b) => sum + b.wordCount, 0);
    const avgReadMinutes =
      totalPosts > 0
        ? Math.round(
            visibleBlogs.reduce((sum, b) => sum + b.readTimeMinutes, 0) / totalPosts
          )
        : 0;
    return { totalPosts, totalWords, avgReadMinutes };
  }, [visibleBlogs]);

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteBlog(id);
      setPendingDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
            Publishing Dashboard
          </h1>
          <p className="text-sm text-zinc-600">
            {currentUser
              ? `Signed in as ${currentUser.name} (${currentUser.email})`
              : 'Browse and manage all published stories, or sign in to view your personal posts.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!currentUser && (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PenSquare className="w-4 h-4" aria-hidden="true" />
            <span>Create Blog</span>
          </button>
        </div>
      </div>

      {/* Tabular Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500">
            {activeScope === 'mine' ? 'My Published Blogs' : 'Published Blogs'}
          </p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-zinc-950">
            {stats.totalPosts}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500">Total Word Count</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-zinc-950">
            {stats.totalWords.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500">Average Reading Time</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-zinc-950">
            {stats.avgReadMinutes} min
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
          {currentUser && (
            <button
              type="button"
              onClick={() => setFilterScope('mine')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScope === 'mine'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              My Posts ({myBlogsCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => setFilterScope('all')}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScope === 'all'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            All Published ({blogs.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter published blogs..."
            aria-label="Filter published blogs"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
          />
        </div>
      </div>

      {/* Published Blogs List */}
      {visibleBlogs.length > 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-200 overflow-hidden">
          {visibleBlogs.map((blog) => {
            const isConfirming = pendingDeleteId === blog.id;
            const isDeleting = deletingId === blog.id;

            return (
              <div
                key={blog.id}
                className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-zinc-50/70 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={() => onViewBlog(blog.id)}
                    className="hidden sm:block w-24 h-18 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100 cursor-pointer"
                  >
                    <BlogCoverImage
                      src={blog.coverImage}
                      alt={blog.title}
                      title={blog.title}
                      className="w-full h-full"
                    />
                  </button>

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700">{blog.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{blog.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{blog.wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{blog.readTimeMinutes} min read</span>
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl font-semibold text-zinc-950 truncate">
                      <button
                        type="button"
                        onClick={() => onViewBlog(blog.id)}
                        className="hover:text-blue-700 transition-colors text-left cursor-pointer"
                      >
                        {blog.title}
                      </button>
                    </h2>

                    <p className="text-sm text-zinc-600 line-clamp-1">
                      {blog.description}
                    </p>

                    <p className="text-xs text-zinc-500">
                      Author: <span className="font-medium text-zinc-700">{blog.authorName}</span>
                    </p>
                  </div>
                </div>

                {/* Row Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 lg:pt-0">
                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-red-700">
                        Delete post?
                      </span>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleConfirmDelete(blog.id)}
                        className="px-3.5 min-h-[40px] text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setPendingDeleteId(null)}
                        className="px-3.5 min-h-[40px] text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onViewBlog(blog.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 min-h-[40px] text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditBlog(blog.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 min-h-[40px] text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(blog.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 min-h-[40px] text-xs font-medium text-red-700 bg-white border border-zinc-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl py-16 px-6 text-center space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-zinc-950">
            No published blogs match this view
          </h2>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            {activeScope === 'mine'
              ? 'You have not published any stories under this account yet.'
              : 'Create a new blog post to see it listed in your dashboard.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {activeScope === 'mine' && (
              <button
                type="button"
                onClick={() => setFilterScope('all')}
                className="px-4 py-2.5 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Show All Blogs ({blogs.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              Publish First Blog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
