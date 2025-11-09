"use client";

import { PlayCircleIcon, PauseCircleIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG } from "@/lib/moods";

export const NowPlayingTopBar = ({ className = "", animated = false }: { className?: string; animated?: boolean }) => {
  const { currentTrack, isPlaying, togglePlay, next, currentMood, volume, setVolume } = usePlayer();
  if (!currentTrack) return null;
  const mood = MOOD_CONFIG[currentMood];
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: -6 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      exit={animated ? { opacity: 0, y: -6 } : undefined}
      transition={{ duration: 0.25 }}
      className={`flex h-12 items-center rounded-2xl bg-white/80 px-3 shadow-lg backdrop-blur ${className}`}
    >
      <div className="flex w-full items-center gap-3">
        <div className="hidden text-xs text-slate-700 sm:block">
          <div className="truncate max-w-[12rem] font-medium">{currentTrack.artist} • {mood.label}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseCircleIcon className="h-5 w-5" /> : <PlayCircleIcon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-3 text-slate-900 shadow-sm backdrop-blur hover:bg-white"
            aria-label="Next"
          >
            <ForwardIcon className="h-5 w-5" />
          </button>
          {volume === 0 ? (
            <SpeakerXMarkIcon className="h-5 w-5 text-slate-700" aria-hidden />
          ) : (
            <SpeakerWaveIcon
              className="h-5 w-5 text-slate-700"
              style={{ opacity: Math.max(0.6, volume) }}
              aria-hidden
            />
          )}
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.currentTarget.value))}
            className="h-2 w-40 appearance-none rounded-full bg-slate-300 [accent-color:#5EEAD4]"
          />
        </div>
      </div>
    </motion.div>
  );
};
