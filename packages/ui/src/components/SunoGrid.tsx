import React from 'react';
import clsx from 'clsx';
import { type SunoTrack, formatDuration } from '@openfm/core';

export interface SunoGridProps {
  tracks: SunoTrack[];
  currentTrackId?: string;
  onTrackSelect: (track: SunoTrack) => void;
  playbackMode: 'shuffle' | 'random';
  onPlaybackModeChange: (mode: 'shuffle' | 'random') => void;
  loop: boolean;
  onLoopToggle: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SunoGrid({
  tracks,
  currentTrackId,
  onTrackSelect,
  playbackMode,
  onPlaybackModeChange,
  loop,
  onLoopToggle,
  isLoading,
  className,
}: SunoGridProps) {
  return (
    <section className={clsx('space-y-6', className)}>
      {/* Controls */}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPlaybackModeChange('shuffle')}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              playbackMode === 'shuffle'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => onPlaybackModeChange('random')}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              playbackMode === 'random'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            Random
          </button>
        </div>

        <label className="flex items-center gap-2">
          <span className="text-sm text-white">Loop</span>
          <button
            type="button"
            role="switch"
            aria-checked={loop}
            onClick={onLoopToggle}
            className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              loop ? 'bg-accent' : 'bg-white/20'
            )}
          >
            <span
              className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white transition',
                loop ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </label>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/60">
          Loading Suno library...
        </div>
      ) : tracks.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/60">
          No tracks available. Check your API key.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tracks.map((track) => (
            <SunoCard
              key={track.id}
              track={track}
              isActive={currentTrackId === track.id}
              onSelect={() => onTrackSelect(track)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface SunoCardProps {
  track: SunoTrack;
  isActive: boolean;
  onSelect: () => void;
}

function SunoCard({ track, isActive, onSelect }: SunoCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'group relative flex flex-col overflow-hidden rounded-2xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        isActive
          ? 'border-accent ring-2 ring-accent shadow-lg shadow-accent/30'
          : 'border-white/10 hover:border-white/30'
      )}
    >
      {/* Cover Art */}
      <div
        className="aspect-square w-full bg-gradient-to-br from-purple-500 to-pink-500"
        style={{
          backgroundImage: track.coverArt ? `url(${track.coverArt})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {isActive && (
          <div className="flex h-full items-center justify-center bg-black/30">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1 bg-slate-900/60 p-3 text-left backdrop-blur">
        <p className="truncate text-sm font-semibold text-white">{track.title}</p>
        <p className="text-xs text-white/60">{formatDuration(track.duration)}</p>
      </div>
    </button>
  );
}

