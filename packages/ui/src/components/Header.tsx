import React from 'react';
import clsx from 'clsx';
import { Settings, User, LogIn } from 'lucide-react';

export interface HeaderProps {
  status: string;
  onAuthClick?: () => void;
  onSettingsClick?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  className?: string;
}

/**
 * OpenFM Header - Always starts with "OpenFM • ..."
 */
export function Header({
  status,
  onAuthClick,
  onSettingsClick,
  isAuthenticated,
  userEmail,
  className,
}: HeaderProps) {
  return (
    <header
      className={clsx(
        'flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-lg',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">
          OpenFM • {status}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && userEmail && (
          <span className="text-sm text-white/60">{userEmail}</span>
        )}
        
        {onAuthClick && (
          <button
            type="button"
            onClick={onAuthClick}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {isAuthenticated ? (
              <>
                <User className="h-4 w-4" />
                Account
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Log In
              </>
            )}
          </button>
        )}

        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}

