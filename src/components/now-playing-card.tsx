"use client";

import { PlayCircleIcon, PauseCircleIcon, ForwardIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import clsx from "clsx";
import { type ReactNode } from "react";

import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG } from "@/lib/moods";
import { formatDuration } from "@/lib/playlist";

export const NowPlayingCard = () => {
  const {
    currentMood,
    currentTrack,
    isPlaying,
    isLoading,
    elapsed,
    duration,
    progress,
    togglePlay,
    next,
    moodMessage,
  } = usePlayer();

  const mood = MOOD_CONFIG[currentMood];

  if (!currentTrack) {
    return (
      <section
        id="now-playing"
        className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-white shadow-lg shadow-black/30"
      >
        Loading OpenFM…
      </section>
    );
  }

  const totalDuration = duration || currentTrack.duration;

  return (
    <section
      id="now-playing"
      className="relative overflow-visible rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-lg"
    >
      {/* Accent glow */}
      <div
        className="absolute inset-x-6 top-4 h-32 rounded-full blur-3xl"
        style={{ background: mood.glow }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Now Playing • {mood.icon} {mood.label}
            </p>
            <h2 className="mt-3 font-heading text-3xl">{currentTrack.title}</h2>
            <p className="text-white/70">{currentTrack.artist} • {currentTrack.session}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
              {isLoading ? "Buffering" : isPlaying ? "Live" : "Paused"}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr]">
          <motion.div key={currentTrack.id} layout className="flex flex-col gap-4">
            <div
              className="aspect-square w-full rounded-2xl border border-white/10 shadow-lg shadow-black/40"
              style={{
                background: `linear-gradient(145deg, ${currentTrack.artworkGradient[0]}, ${currentTrack.artworkGradient[1]})`,
              }}
            />
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              {moodMessage}
            </div>
          </motion.div>

          <div className="flex flex-col justify-between gap-6">
            <p className="text-sm text-white/70">{currentTrack.story}</p>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(progress, 1) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>{formatDuration(elapsed)}</span>
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ControlButton
                label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
                className="flex-1"
                isPrimary
                icon={isPlaying ? <PauseCircleIcon className="h-10 w-10" /> : <PlayCircleIcon className="h-10 w-10" />}
                disabled={isLoading}
              />
              <ControlButton label="Next track" onClick={next} icon={<ForwardIcon className="h-5 w-5" />} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ControlButton = ({
  label,
  onClick,
  icon,
  isPrimary,
  className,
  disabled,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  isPrimary?: boolean;
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    className={clsx(
      "flex items-center justify-center rounded-2xl border px-4 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-50",
      isPrimary ? "border-white/10 bg-white text-slate-900 hover:bg-slate-200" : "border-white/10 bg-white/5 text-white hover:border-white/40",
      className,
    )}
    onClick={onClick}
    aria-label={label}
    disabled={disabled}
  >
    {icon}
  </button>
);

