import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PlayCircle, PauseCircle, SkipForward } from 'lucide-react';
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
  message,
  className,
}: NowPlayingProps) {
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
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              NOW PLAYING
            </p>
            <span className="text-xs text-white/50">•</span>
            <span className="text-xs">{mood.icon}</span>
            <p className="text-xs font-semibold text-white uppercase">{mood.label.toUpperCase()}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-white/70">
              {isLoading ? 'Buffering' : isPlaying ? 'Live' : 'PAUSED'}
            </span>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
          <p className="text-white/70">{currentTrack.artist} • {currentTrack.session || 'Session'}</p>
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
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {message}
              </div>
            )}
          </motion.div>

          <div className="flex flex-col justify-between gap-6">
            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed">
              {currentTrack.story || `${currentTrack.title} from ${currentTrack.session || 'the session'} — ${currentTrack.mood === 'epic' ? 'engineered for heroic raids and cinematic finales' : 'perfect for your stream'}.`}
            </p>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="h-1 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/30 transition-all"
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
                onClick={onTogglePlay}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center rounded-xl bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
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

    </section>
  );
}

