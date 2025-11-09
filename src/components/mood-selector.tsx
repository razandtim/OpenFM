"use client";

import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG, MOOD_ORDER } from "@/lib/moods";
import type { MoodId } from "@/lib/types";

export const MoodSelector = () => {
  const { currentMood, setMood, isLoading, isPlaying } = usePlayer();

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-lg">
      <div className="flex items-center justify-between px-2 pb-3 text-xs uppercase tracking-[0.35em] text-white/50">
        <span>Choose a mood</span>
        <span className="text-white/60">
          {isLoading ? "Tuning..." : isPlaying ? "Live" : "Paused"}
        </span>
      </div>
      <div className="pb-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MOOD_ORDER.map((mood) => (
            <MoodButton
              key={mood}
              mood={mood}
              isActive={currentMood === mood}
              onSelect={() => setMood(mood)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const MoodButton = ({
  mood,
  isActive,
  onSelect,
}: {
  mood: MoodId;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const config = MOOD_CONFIG[mood];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 p-4 text-left transition hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        isActive ? "bg-white/10 shadow-lg shadow-black/30" : "bg-slate-900/40",
      )}
      aria-pressed={isActive}
    >
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="mood-highlight"
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at 20% 20%, ${config.accentMuted}, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 space-y-2">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <p className="font-semibold text-white">{config.label}</p>
          <p className="text-xs text-white/70">{config.tagline}</p>
        </div>
      </div>
    </button>
  );
};
