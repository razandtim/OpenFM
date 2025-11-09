"use client";

import clsx from "clsx";
import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG, MOOD_ORDER } from "@/lib/moods";

export const MoodChips = () => {
  const { currentMood, setMood } = usePlayer();
  return (
    <section className="rounded-3xl border border-white/10 bg-white/40 p-4 shadow-inner backdrop-blur">
      <p className="px-1 pb-2 text-xs uppercase tracking-[0.35em] text-slate-700">Choose your mood</p>
      <div className="flex flex-wrap gap-3">
        {MOOD_ORDER.map((mood) => {
          const cfg = MOOD_CONFIG[mood];
          return (
            <button
              key={mood}
              type="button"
              onClick={() => setMood(mood)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium shadow-sm",
                currentMood === mood ? "ring-2 ring-slate-800" : undefined,
              )}
              style={{ background: cfg.accentMuted, color: "#0b0f1a" }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

