import { BlogCategory, BlogPost, CoverPreset } from '../types/blog';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Engineering',
  'Frontend',
  'Backend',
  'Design',
  'Career',
];

export const COVER_PRESETS: CoverPreset[] = [
  {
    id: 'architecture',
    label: 'Studio Architecture Desk',
    url: '/src/assets/images/blog_cover_architecture_1795093229011.jpg',
  },
  {
    id: 'backend',
    label: 'Modular Ceramic Pathways',
    url: '/src/assets/images/blog_cover_backend_1795093228141.jpg',
  },
  {
    id: 'javascript',
    label: 'North Window Workspace',
    url: '/src/assets/images/blog_cover_javascript_1795093228261.jpg',
  },
  {
    id: 'css-grid',
    label: 'Swiss Paper Grid & Brass',
    url: '/src/assets/images/blog_cover_css_grid_1795093228294.jpg',
  },
  {
    id: 'career',
    label: 'Collaborative Library Study',
    url: '/src/assets/images/blog_cover_career_1795093228038.jpg',
  },
];

export function computeReadingMetrics(content: string): {
  wordCount: number;
  readTimeMinutes: number;
} {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
  return { wordCount: words, readTimeMinutes };
}

export const INITIAL_SAMPLE_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Designing Calm Web Interfaces: Whitespace as Structure',
    description:
      'Why generous negative space, crisp typographic hierarchy, and restrained color budgets outperform noisy dashboards every time.',
    content: `Great software rarely feels loud. When users open an application for the first time, their attention is immediately taxed by every border, badge, and competing call to action on the screen. Treating whitespace as an active architectural material—rather than leftover background—gives readers breathing room and establishes clear visual priorities.

Start with a strict typographic scale. Pair an expressive editorial serif for article headlines with a highly readable geometric sans-serif for navigation, forms, and long-form prose. Constraining body paragraphs to a comfortable measure of 65 to 75 characters per line reduces eye fatigue and transforms ordinary documentation into something people genuinely enjoy reading.

Color discipline follows the same principle. Reserve your primary accent hue strictly for actionable controls—primary publish buttons, active navigation indicators, and focused form fields. When 90 percent of the canvas remains neutral alabaster, paper white, and deep charcoal ink, that remaining 10 percent accent carries unmistakable authority.

Finally, eliminate redundant decorative containers. Instead of wrapping every tag, date, and author name inside pill borders, render metadata as quiet inline text separated by clean middots. The result is an interface that feels lighter, loads faster, and keeps the spotlight squarely on the writing itself.`,
    category: 'Design',
    coverImage: '/src/assets/images/blog_cover_architecture_1795093229011.jpg',
    authorName: 'Alex Rivera',
    authorEmail: 'alex@inkline.dev',
    publishedAt: 'Nov 14, 2026',
    ...computeReadingMetrics(
      `Great software rarely feels loud. When users open an application for the first time, their attention is immediately taxed by every border, badge, and competing call to action on the screen. Treating whitespace as an active architectural material—rather than leftover background—gives readers breathing room and establishes clear visual priorities.

Start with a strict typographic scale. Pair an expressive editorial serif for article headlines with a highly readable geometric sans-serif for navigation, forms, and long-form prose. Constraining body paragraphs to a comfortable measure of 65 to 75 characters per line reduces eye fatigue and transforms ordinary documentation into something people genuinely enjoy reading.

Color discipline follows the same principle. Reserve your primary accent hue strictly for actionable controls—primary publish buttons, active navigation indicators, and focused form fields. When 90 percent of the canvas remains neutral alabaster, paper white, and deep charcoal ink, that remaining 10 percent accent carries unmistakable authority.

Finally, eliminate redundant decorative containers. Instead of wrapping every tag, date, and author name inside pill borders, render metadata as quiet inline text separated by clean middots. The result is an interface that feels lighter, loads faster, and keeps the spotlight squarely on the writing itself.`
    ),
  },
  {
    id: 'blog-2',
    title: 'Understanding REST APIs and Express Routing from Scratch',
    description:
      'A practical walkthrough of building predictable HTTP endpoints, validating JSON payloads, and handling errors cleanly in Node.js.',
    content: `Every full-stack web application relies on a clear contract between the browser client and the server. Representational State Transfer—commonly known as REST—gives us a straightforward mental model built directly on top of standard HTTP verbs: GET to retrieve resources, POST to create new entries, PUT or PATCH to update existing records, and DELETE to remove them.

In an Express server, keeping route handlers thin and focused makes debugging dramatically easier. Each endpoint should parse and validate incoming inputs first, return meaningful HTTP status codes like 400 Bad Request or 401 Unauthorized when expectations fail, and respond with consistent JSON structures.

Separating persistence logic from route definitions also pays off early in an internship project. Even if you start with a local JSON store or in-memory array during prototyping, encapsulating read and write operations behind helper functions means you can later swap in PostgreSQL or SQLite without rewriting your frontend fetch calls.

Always test your error paths as carefully as your happy paths. Returning clear, human-readable error messages from the API allows your React forms to display inline guidance rather than leaving users wondering why a submission failed.`,
    category: 'Backend',
    coverImage: '/src/assets/images/blog_cover_backend_1795093228141.jpg',
    authorName: 'Priya Nair',
    authorEmail: 'priya@inkline.dev',
    publishedAt: 'Nov 10, 2026',
    ...computeReadingMetrics(
      `Every full-stack web application relies on a clear contract between the browser client and the server. Representational State Transfer—commonly known as REST—gives us a straightforward mental model built directly on top of standard HTTP verbs: GET to retrieve resources, POST to create new entries, PUT or PATCH to update existing records, and DELETE to remove them.

In an Express server, keeping route handlers thin and focused makes debugging dramatically easier. Each endpoint should parse and validate incoming inputs first, return meaningful HTTP status codes like 400 Bad Request or 401 Unauthorized when expectations fail, and respond with consistent JSON structures.

Separating persistence logic from route definitions also pays off early in an internship project. Even if you start with a local JSON store or in-memory array during prototyping, encapsulating read and write operations behind helper functions means you can later swap in PostgreSQL or SQLite without rewriting your frontend fetch calls.

Always test your error paths as carefully as your happy paths. Returning clear, human-readable error messages from the API allows your React forms to display inline guidance rather than leaving users wondering why a submission failed.`
    ),
  },
  {
    id: 'blog-3',
    title: 'Mastering Async/Await and Clean State Management in JavaScript',
    description:
      'Practical patterns for avoiding race conditions, handling loading states gracefully, and keeping UI updates synchronized with API data.',
    content: `Asynchronous programming is often the first real hurdle when moving from static HTML pages to interactive full-stack applications. Fetching blog posts, submitting login credentials, and saving drafts all happen over the network, which means your user interface must gracefully represent pending, succeeded, and failed states.

Using async/await syntax inside try/catch/finally blocks keeps asynchronous control flow linear and easy to read. Make sure every network request flips a loading flag back to false inside the finally block so buttons never remain permanently disabled after an unexpected network timeout.

Just as important is deciding where your source of truth lives. Keep server-fetched collections—like published articles—in a single top-level state store or custom hook, and derive filtered views and statistics directly from that array rather than duplicating counts into separate state variables.

When creating or deleting a post, updating local state immediately after a confirmed 200 or 201 API response keeps the dashboard snappy while guaranteeing your screen reflects persisted data.`,
    category: 'Frontend',
    coverImage: '/src/assets/images/blog_cover_javascript_1795093228261.jpg',
    authorName: 'Marcus Chen',
    authorEmail: 'marcus@inkline.dev',
    publishedAt: 'Nov 06, 2026',
    ...computeReadingMetrics(
      `Asynchronous programming is often the first real hurdle when moving from static HTML pages to interactive full-stack applications. Fetching blog posts, submitting login credentials, and saving drafts all happen over the network, which means your user interface must gracefully represent pending, succeeded, and failed states.

Using async/await syntax inside try/catch/finally blocks keeps asynchronous control flow linear and easy to read. Make sure every network request flips a loading flag back to false inside the finally block so buttons never remain permanently disabled after an unexpected network timeout.

Just as important is deciding where your source of truth lives. Keep server-fetched collections—like published articles—in a single top-level state store or custom hook, and derive filtered views and statistics directly from that array rather than duplicating counts into separate state variables.

When creating or deleting a post, updating local state immediately after a confirmed 200 or 201 API response keeps the dashboard snappy while guaranteeing your screen reflects persisted data.`
    ),
  },
  {
    id: 'blog-4',
    title: 'Responsive CSS Grid Layouts Without Media Query Chaos',
    description:
      'How modern CSS Grid tracks, fluid spacing, and disciplined container widths adapt seamlessly from mobile phones to widescreen monitors.',
    content: `Building mobile-friendly layouts used to require dozens of fragile breakpoint rules. Modern CSS Grid and Flexbox let us express layout intent directly so cards reflow naturally across phone, tablet, and desktop viewports with minimal overrides.

For editorial card grids, pairing a centered container with generous horizontal padding and a three-tier column progression—one column on small screens, two on medium tablets, and three on desktop—maintains balanced proportions at every width. Keeping card image containers locked to a consistent 4:3 aspect ratio prevents jagged row heights even when headlines vary in length.

Navigation bars deserve equal care on small screens. Instead of shrinking desktop links until they wrap onto two awkward lines, swap cleanly into a compact slide-down mobile drawer below the medium breakpoint. That preserves single-line controls everywhere while ensuring touch targets stay comfortably above 44 pixels tall.`,
    category: 'Engineering',
    coverImage: '/src/assets/images/blog_cover_css_grid_1795093228294.jpg',
    authorName: 'Elena Vance',
    authorEmail: 'elena@inkline.dev',
    publishedAt: 'Nov 02, 2026',
    ...computeReadingMetrics(
      `Building mobile-friendly layouts used to require dozens of fragile breakpoint rules. Modern CSS Grid and Flexbox let us express layout intent directly so cards reflow naturally across phone, tablet, and desktop viewports with minimal overrides.

For editorial card grids, pairing a centered container with generous horizontal padding and a three-tier column progression—one column on small screens, two on medium tablets, and three on desktop—maintains balanced proportions at every width. Keeping card image containers locked to a consistent 4:3 aspect ratio prevents jagged row heights even when headlines vary in length.

Navigation bars deserve equal care on small screens. Instead of shrinking desktop links until they wrap onto two awkward lines, swap cleanly into a compact slide-down mobile drawer below the medium breakpoint. That preserves single-line controls everywhere while ensuring touch targets stay comfortably above 44 pixels tall.`
    ),
  },
  {
    id: 'blog-5',
    title: 'What I Learned in My First Full Stack Development Internship',
    description:
      'Reflections on code reviews, breaking large features into small milestones, and writing code that teammates can actually maintain.',
    content: `Walking into a full-stack internship, it is easy to assume that speed is what separates experienced engineers from beginners. Within my first two weeks, I learned the opposite is true: clarity, steady communication, and small verifiable commits matter far more than rushing through a ticket in one sitting.

Breaking a multi-page feature—like a blog application with authentication, a dashboard, and a publishing workflow—into clear vertical slices makes progress visible right away. Start by defining your data types, verify your API endpoints return predictable shapes, and then wire each page cleanly against those contracts.

Code reviews quickly became my favorite learning loop. Reading constructive feedback on naming, accessibility labels, and edge-case validation taught me to inspect my own pull requests through the eyes of a teammate before asking anyone else to review them.`,
    category: 'Career',
    coverImage: '/src/assets/images/blog_cover_career_1795093228038.jpg',
    authorName: 'Alex Rivera',
    authorEmail: 'alex@inkline.dev',
    publishedAt: 'Oct 28, 2026',
    ...computeReadingMetrics(
      `Walking into a full-stack internship, it is easy to assume that speed is what separates experienced engineers from beginners. Within my first two weeks, I learned the opposite is true: clarity, steady communication, and small verifiable commits matter far more than rushing through a ticket in one sitting.

Breaking a multi-page feature—like a blog application with authentication, a dashboard, and a publishing workflow—into clear vertical slices makes progress visible right away. Start by defining your data types, verify your API endpoints return predictable shapes, and then wire each page cleanly against those contracts.

Code reviews quickly became my favorite learning loop. Reading constructive feedback on naming, accessibility labels, and edge-case validation taught me to inspect my own pull requests through the eyes of a teammate before asking anyone else to review them.`
    ),
  },
];
