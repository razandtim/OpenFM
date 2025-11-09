"use client";

import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG } from "@/lib/moods";

export const NowPlayingTopBar = () => {
  const { currentTrack, isPlaying, togglePlay, currentMood, volume, setVolume } = usePlayer();
  if (!currentTrack) return null;
  const mood = MOOD_CONFIG[currentMood];
  return (
    <div className="sticky top-4 z-30 ml-0 rounded-2xl bg-white/80 p-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="hidden text-xs text-slate-700 sm:block">
          <div className="truncate max-w-[12rem] font-medium">{currentTrack.artist} • {mood.label}</div>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white"
        >
          {isPlaying ? <PauseCircleIcon className="h-5 w-5" /> : <PlayCircleIcon className="h-5 w-5" />}
          <span className="hidden sm:inline">{isPlaying ? "pause" : "plei"}</span>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-700">vl</span>
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
    </div>
  );
};

