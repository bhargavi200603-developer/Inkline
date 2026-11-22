import { ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import BlogCoverImage from '../components/BlogCoverImage';
import { BLOG_CATEGORIES } from '../data/sampleBlogs';
import type { BlogCategory, BlogPost, PageRoute } from '../types/blog';

interface HomePageProps {
  blogs: BlogPost[];
  isLoading: boolean;
  onSelectBlog: (blogId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export default function HomePage({
  blogs,
  isLoading,
  onSelectBlog,
  onNavigate,
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredBlog = blogs[0] ?? null;

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesQuery =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.description.toLowerCase().includes(q) ||
        blog.authorName.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Exclude featured lead card when showing unfiltered default view to avoid duplication
  const gridBlogs = useMemo(() => {
    if (selectedCategory === 'All' && !searchQuery.trim() && featuredBlog) {
      return filteredBlogs.slice(1);
    }
    return filteredBlogs;
  }, [filteredBlogs, selectedCategory, searchQuery, featuredBlog]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 space-y-4 py-4">
            <div className="h-4 w-36 bg-zinc-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-zinc-200 rounded animate-pulse" />
            <div className="h-20 w-5/6 bg-zinc-200 rounded animate-pulse" />
          </div>
          <div className="lg:col-span-6 h-80 bg-zinc-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-zinc-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-32 bg-zinc-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-zinc-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      {/* Editorial Hero Split featuring lead article */}
      {featuredBlog ? (
        <section aria-label="Featured article" className="pb-10 border-b border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                  <span className="text-blue-700 font-semibold">Featured Story</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredBlog.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{featuredBlog.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{featuredBlog.readTimeMinutes} min read</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight leading-[1.15] text-zinc-950">
                  {featuredBlog.title}
                </h1>

                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                  {featuredBlog.description}
                </p>
              </div>

              <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-zinc-600">
                  By <span className="font-semibold text-zinc-900">{featuredBlog.authorName}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBlog(featuredBlog.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <button
                type="button"
                onClick={() => onSelectBlog(featuredBlog.id)}
                className="group block w-full h-full min-h-[260px] lg:min-h-[340px] rounded-xl overflow-hidden border border-zinc-200 bg-white text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <BlogCoverImage
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  title={featuredBlog.title}
                  className="w-full h-full lg:h-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 text-center bg-white border border-zinc-200 rounded-xl px-6">
          <h1 className="font-serif text-3xl font-semibold text-zinc-950">
            No articles published yet
          </h1>
          <p className="mt-2 text-zinc-600 max-w-md mx-auto">
            Publish your first story to populate the Inkline editorial feed.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            Create Blog
          </button>
        </section>
      )}

      {/* Filter Tabs + Live Search Toolbar */}
      <section aria-label="Published articles" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter blogs by category"
            className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg max-w-full overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              All Stories
            </button>
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, authors, topics..."
              aria-label="Search blog articles"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
            />
          </div>
        </div>

        {/* Blog Cards Grid */}
        {gridBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col transition-colors duration-150 hover:border-zinc-300"
              >
                <button
                  type="button"
                  onClick={() => onSelectBlog(blog.id)}
                  className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                >
                  <BlogCoverImage
                    src={blog.coverImage}
                    alt={blog.title}
                    title={blog.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </button>

                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700">{blog.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{blog.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{blog.readTimeMinutes} min read</span>
                    </div>

                    <h2 className="font-serif text-xl font-semibold leading-snug text-zinc-950">
                      <button
                        type="button"
                        onClick={() => onSelectBlog(blog.id)}
                        className="text-left hover:text-blue-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                      >
                        {blog.title}
                      </button>
                    </h2>

                    <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                      {blog.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-zinc-700 truncate">
                      {blog.authorName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectBlog(blog.id)}
                      className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Read more</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl py-14 px-6 text-center space-y-3">
            <p className="font-serif text-xl font-semibold text-zinc-900">
              No matching blog posts found
            </p>
            <p className="text-sm text-zinc-600">
              Try clearing your search filter or publish a new article in this category.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => onNavigate('create')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                Write New Blog
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
