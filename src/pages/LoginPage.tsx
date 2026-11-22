import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { loginUser } from '../services/api';
import type { AuthResponse, PageRoute } from '../types/blog';

interface LoginPageProps {
  onSuccess: (session: AuthResponse) => void;
  onNavigate: (page: PageRoute) => void;
}

export default function LoginPage({ onSuccess, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await loginUser(trimmedEmail, password);
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('alex@inkline.dev');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-600">
            Sign in to publish new stories and manage your dashboard.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-zinc-800"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@inkline.dev"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-zinc-800"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3.5 pr-11 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-800 rounded-md cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {isSubmitting && (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-200 space-y-3">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full py-2 px-3 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
          >
            Use Demo Account (alex@inkline.dev)
          </button>

          <p className="text-center text-sm text-zinc-600">
            New to Inkline?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-medium text-blue-700 hover:text-blue-800 underline underline-offset-4 cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
