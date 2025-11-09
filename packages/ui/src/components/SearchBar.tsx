import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import type { MoodId, SunoTrack } from '@openfm/core';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  searchResults?: {
    sunoTracks?: SunoTrack[];
    moodTracks?: Array<{ id: string; title: string; mood: MoodId }>;
  };
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({ onSearch, searchResults, isLoading, className }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  return (
    <div className={clsx('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-12 py-3 text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </form>

      {/* Search Results */}
      {searchResults && (searchResults.sunoTracks?.length || searchResults.moodTracks?.length) && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-white/10 bg-slate-900/95 p-4 backdrop-blur-xl">
          {isLoading && (
            <div className="py-4 text-center text-white/60">Searching...</div>
          )}
          
          {searchResults.sunoTracks && searchResults.sunoTracks.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider text-white/50">Suno Tracks</h3>
              <div className="space-y-2">
                {searchResults.sunoTracks.map((track) => (
                  <div
                    key={track.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                  >
                    <p className="font-medium text-white">{track.title}</p>
                    <p className="text-sm text-white/60">Suno</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.moodTracks && searchResults.moodTracks.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-wider text-white/50">Mood Tracks</h3>
              <div className="space-y-2">
                {searchResults.moodTracks.map((track) => (
                  <div
                    key={track.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                  >
                    <p className="font-medium text-white">{track.title}</p>
                    <p className="text-sm text-white/60 capitalize">{track.mood}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

