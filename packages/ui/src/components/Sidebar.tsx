import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Home, Music, Library, Heart } from 'lucide-react';

export interface SidebarProps {
  onAuthClick?: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  isAuthenticated?: boolean;
  className?: string;
}

export function Sidebar({
  onAuthClick,
  onSignIn,
  onSignUp,
  isAuthenticated,
  className,
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900/80 p-6 backdrop-blur-lg',
        className
      )}
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">OpenFM</h1>
      </div>

      {/* Navigation */}
      <nav className="mb-8 flex-1 space-y-2">
        <Link
          to="/player"
          className={clsx(
            'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition',
            location.pathname === '/player'
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          <Home className="h-5 w-5" />
          <span>hom</span>
        </Link>
        <Link
          to="/player"
          className={clsx(
            'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition',
            'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          <Music className="h-5 w-5" />
          <span>muzic</span>
        </Link>
        <Link
          to="/player"
          className={clsx(
            'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition',
            'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          <Library className="h-5 w-5" />
          <span>library</span>
        </Link>
        <Link
          to="/player"
          className={clsx(
            'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition',
            'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          <Heart className="h-5 w-5" />
          <span>What&apos;s ur mood</span>
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="space-y-3">
        {!isAuthenticated ? (
          <>
            {onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                LOG IN
              </button>
            )}
            {onSignUp && (
              <button
                type="button"
                onClick={onSignUp}
                className="w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                REGISTER
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onAuthClick}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Account
          </button>
        )}
      </div>

    </aside>
  );
}

