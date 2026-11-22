export type PageRoute =
  | 'home'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'create'
  | 'article';

export type BlogCategory =
  | 'Engineering'
  | 'Frontend'
  | 'Backend'
  | 'Design'
  | 'Career';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  coverImage: string;
  authorName: string;
  authorEmail: string;
  publishedAt: string;
  readTimeMinutes: number;
  wordCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CoverPreset {
  id: string;
  label: string;
  url: string;
}
