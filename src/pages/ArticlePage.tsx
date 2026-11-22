import { ArrowLeft, Edit3 } from 'lucide-react';
import BlogCoverImage from '../components/BlogCoverImage';
import type { BlogPost, PageRoute } from '../types/blog';

interface ArticlePageProps {
  blog: BlogPost | null;
  isLoading?: boolean;
  onNavigate: (page: PageRoute) => void;
  onEditBlog: (blogId: string) => void;
}

export default function ArticlePage({
  blog,
  isLoading = false,
  onNavigate,
  onEditBlog,
}: ArticlePageProps) {
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse" />
        <div className="h-10 w-5/6 bg-zinc-200 rounded animate-pulse" />
        <div className="h-5 w-2/3 bg-zinc-200 rounded animate-pulse" />
        <div className="aspect-[16/9] w-full bg-zinc-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold text-zinc-950">
          Article not found
        </h1>
        <p className="text-zinc-600">
          The blog post you selected may have been removed or moved.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  const paragraphs = blog.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex items-center justify-between gap-4 pb-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => onEditBlog(blog.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Edit Post</span>
        </button>
      </div>

      <header className="space-y-4 pb-8 border-b border-zinc-200">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-blue-700">{blog.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{blog.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{blog.readTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{blog.wordCount} words</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.14] text-zinc-950">
          {blog.title}
        </h1>

        <p className="text-lg text-zinc-600 leading-relaxed">{blog.description}</p>

        <div className="pt-2 text-sm text-zinc-600">
          Written by <span className="font-semibold text-zinc-900">{blog.authorName}</span>
        </div>
      </header>

      <div className="my-8 rounded-xl overflow-hidden border border-zinc-200 bg-white aspect-[16/9]">
        <BlogCoverImage
          src={blog.coverImage}
          alt={blog.title}
          title={blog.title}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-[68ch] mx-auto space-y-6 text-[17px] leading-[1.75] text-zinc-800">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? 'first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-zinc-950'
                : ''
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
