import React, { useState } from 'react';
import clsx from 'clsx';
import { X, LogOut, Mail, Lock, Loader2 } from 'lucide-react';

export interface AuthProps {
  isSignedIn: boolean;
  userEmail?: string;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onClose: () => void;
  error?: string;
  isLoading?: boolean;
}

export function Auth({
  isSignedIn,
  userEmail,
  onSignIn,
  onSignUp,
  onSignOut,
  onClose,
  error,
  isLoading,
}: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await onSignIn(email, password);
    } else {
      await onSignUp(email, password);
    }
  };

  if (isSignedIn) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Account</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Mail className="h-5 w-5 text-white/60" />
            <div>
              <p className="text-sm text-white/60">Signed in as</p>
              <p className="font-medium">{userEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="w-full text-center text-sm text-white/60 hover:text-white"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

