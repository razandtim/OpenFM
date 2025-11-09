import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { PlayCircle, PauseCircle, SkipForward, SkipBack, X, List } from 'lucide-react';
import { getMoodConfig, formatDuration, type Track, type MoodId } from '@openfm/core';

export interface NowPlayingProps {
  currentTrack?: Track;
  currentMood: MoodId;
  isPlaying: boolean;
  isLoading: boolean;
  elapsed: number;
  duration: number;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  queue?: Track[];
  message?: string;
  className?: string;
}

export function NowPlaying({
  currentTrack,
  currentMood,
  isPlaying,
  isLoading,
  elapsed,
  duration,
  progress,
  onTogglePlay,
  onNext,
  onPrevious,
  queue = [],
  message,
  className,
}: NowPlayingProps) {
  const [showQueue, setShowQueue] = useState(false);
  const mood = getMoodConfig(currentMood);

  if (!currentTrack) {
    return (
      <section className={clsx('rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-white shadow-lg', className)}>
        <p className="text-white/60">No track playing</p>
      </section>
    );
  }

  const artwork = currentTrack.artwork || mood.color;
  const isGradient = !currentTrack.artwork;

  return (
    <section
      className={clsx(
        'relative overflow-visible rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl backdrop-blur-lg',
        className
      )}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-x-6 top-4 h-32 rounded-full blur-3xl"
        style={{ background: mood.glow }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Now Playing • {mood.icon} {mood.label}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-white/70">{currentTrack.artist}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-white/70">
              {isLoading ? 'Buffering' : isPlaying ? 'Live' : 'Paused'}
            </span>
            
            {queue.length > 0 && (
              <button
                type="button"
                onClick={() => setShowQueue(!showQueue)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <List className="h-4 w-4" />
                Queue ({queue.length})
              </button>
            )}
          </div>
        </div>

        {/* Artwork & Controls */}
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            <div
              className="aspect-square w-full rounded-2xl border border-white/10 shadow-lg"
              style={{
                background: isGradient
                  ? `linear-gradient(135deg, ${mood.color}, ${mood.color}dd)`
                  : `url(${artwork})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {message && (
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
                {message}
              </div>
            )}
          </motion.div>

          <div className="flex flex-col justify-between gap-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${Math.min(progress * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>{formatDuration(elapsed)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onPrevious}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Previous track"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8" />
                ) : (
                  <PlayCircle className="h-8 w-8" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Next track"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Overlay */}
      <AnimatePresence>
        {showQueue && queue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute inset-x-6 top-full z-30 mt-4 max-h-96 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Queue ({queue.length})</h3>
              <button
                type="button"
                onClick={() => setShowQueue(false)}
                className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close queue"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {queue.slice(0, 20).map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{track.title}</p>
                    <p className="text-xs text-white/60">{track.artist}</p>
                  </div>
                  <span className="text-xs text-white/60">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

