import { Menu, PenSquare, X } from 'lucide-react';
import { useState } from 'react';
import type { PageRoute, User } from '../types/blog';

interface NavbarProps {
  currentPage: PageRoute;
  currentUser: User | null;
  onNavigate: (page: PageRoute) => void;
  onLogout: () => void;
}

export default function Navbar({
  currentPage,
  currentUser,
  onNavigate,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const navLinkClass = (active: boolean) =>
    `relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
      active
        ? 'text-zinc-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-blue-700'
        : 'text-zinc-600 hover:text-zinc-950'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-serif text-2xl font-semibold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Inkline
        </button>

        {/* Zone 2: 4–5 single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`${navLinkClass(currentPage === 'home' || currentPage === 'article')} cursor-pointer`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`${navLinkClass(currentPage === 'dashboard')} cursor-pointer`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => handleNav('create')}
            className={`${navLinkClass(currentPage === 'create')} cursor-pointer`}
          >
            Create Blog
          </button>
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => handleNav('login')}
                className={`${navLinkClass(currentPage === 'login')} cursor-pointer`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav('register')}
                className={`${navLinkClass(currentPage === 'register')} cursor-pointer`}
              >
                Register
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="py-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              Sign Out
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('create')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <PenSquare className="w-4 h-4" aria-hidden="true" />
            <span>Write Post</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'home' || currentPage === 'article'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'dashboard'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => handleNav('create')}
            className={`w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'create'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            Create Blog
          </button>
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => handleNav('login')}
                className={`w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 'login'
                    ? 'bg-zinc-100 text-zinc-950'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav('register')}
                className={`w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 'register'
                    ? 'bg-zinc-100 text-zinc-950'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Register
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left px-3 min-h-[44px] rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Sign Out ({currentUser.name})
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
