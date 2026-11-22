import { AlertCircle, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import BlogCoverImage from '../components/BlogCoverImage';
import {
  BLOG_CATEGORIES,
  COVER_PRESETS,
  computeReadingMetrics,
} from '../data/sampleBlogs';
import type { BlogCategory, BlogPost, PageRoute, User } from '../types/blog';

interface CreateBlogPageProps {
  currentUser: User | null;
  editingBlog: BlogPost | null;
  onPublish: (payload: {
    title: string;
    description: string;
    content: string;
    category: BlogCategory;
    coverImage: string;
    authorName: string;
    authorEmail: string;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    payload: {
      title: string;
      description: string;
      content: string;
      category: BlogCategory;
      coverImage: string;
    }
  ) => Promise<void>;
  onNavigate: (page: PageRoute) => void;
}

export default function CreateBlogPage({
  currentUser,
  editingBlog,
  onPublish,
  onUpdate,
  onNavigate,
}: CreateBlogPageProps) {
  const [title, setTitle] = useState(editingBlog?.title ?? '');
  const [description, setDescription] = useState(editingBlog?.description ?? '');
  const [content, setContent] = useState(editingBlog?.content ?? '');
  const [category, setCategory] = useState<BlogCategory>(
    editingBlog?.category ?? 'Engineering'
  );
  const [coverImage, setCoverImage] = useState(
    editingBlog?.coverImage ?? COVER_PRESETS[0].url
  );
  const [authorName, setAuthorName] = useState(
    editingBlog?.authorName ?? currentUser?.name ?? ''
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metrics = useMemo(() => computeReadingMetrics(content), [content]);
  const isEditMode = Boolean(editingBlog);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanContent = content.trim();

    if (cleanTitle.length < 4) {
      setError('Please enter a blog title of at least 4 characters.');
      return;
    }
    if (cleanDescription.length < 10) {
      setError('Please enter a short description of at least 10 characters.');
      return;
    }
    if (cleanContent.length < 20) {
      setError('Please write blog content of at least 20 characters before publishing.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBlog) {
        await onUpdate(editingBlog.id, {
          title: cleanTitle,
          description: cleanDescription,
          content: cleanContent,
          category,
          coverImage,
        });
      } else {
        await onPublish({
          title: cleanTitle,
          description: cleanDescription,
          content: cleanContent,
          category,
          coverImage,
          authorName: authorName.trim() || currentUser?.name || 'Internship Author',
          authorEmail: currentUser?.email || 'author@inkline.dev',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-8">
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog'}
          </h1>
          <p className="text-sm text-zinc-600">
            {isEditMode
              ? 'Update your story details and save changes to the published feed.'
              : 'Draft your article with a clear title, short summary, and full body content.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Dashboard</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="blog-title"
            className="block text-sm font-medium text-zinc-800"
          >
            Blog Title
          </label>
          <input
            id="blog-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Building Clean Full-Stack APIs with Node and React"
            className="w-full px-3.5 py-2.5 text-base bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="blog-description"
            className="block text-sm font-medium text-zinc-800"
          >
            Short Description
          </label>
          <textarea
            id="blog-description"
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A concise two-sentence summary shown on the Home page blog card..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="blog-category"
              className="block text-sm font-medium text-zinc-800"
            >
              Category
            </label>
            <select
              id="blog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {!isEditMode && (
            <div className="space-y-1.5">
              <label
                htmlFor="blog-author"
                className="block text-sm font-medium text-zinc-800"
              >
                Author Name
              </label>
              <input
                id="blog-author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (defaults to Guest or signed-in user)"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Cover Artwork Picker */}
        <div className="space-y-2.5">
          <span className="block text-sm font-medium text-zinc-800">
            Cover Image
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {COVER_PRESETS.map((preset) => {
              const selected = coverImage === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  aria-pressed={selected}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    selected
                      ? 'border-blue-700 ring-2 ring-blue-700/25'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <BlogCoverImage
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full"
                  />
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="pt-1">
            <label htmlFor="blog-cover-url" className="sr-only">
              Custom Cover Image URL (optional)
            </label>
            <input
              id="blog-cover-url"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste a custom image URL (optional)"
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="blog-content"
              className="block text-sm font-medium text-zinc-800"
            >
              Article Content
            </label>
            <span className="text-xs font-mono tabular-nums text-zinc-500">
              {metrics.wordCount} words · {metrics.readTimeMinutes} min read
            </span>
          </div>
          <textarea
            id="blog-content"
            rows={12}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article paragraphs here. Separate paragraphs with a blank line for crisp editorial formatting..."
            className="w-full px-3.5 py-3 text-sm leading-relaxed bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors resize-y"
          />
        </div>

        <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {isSubmitting && (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            <span>
              {isSubmitting
                ? isEditMode
                  ? 'Saving Changes...'
                  : 'Publishing...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Publish Blog'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
