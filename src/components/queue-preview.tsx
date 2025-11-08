"use client";

import { motion, AnimatePresence } from "framer-motion";

import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG } from "@/lib/moods";
import { formatDuration } from "@/lib/playlist";

export const QueuePreview = () => {
  const { upcoming, next, queue, currentTrack } = usePlayer();

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-white shadow-lg shadow-black/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Upcoming Tracks
          </p>
          <p className="text-lg font-semibold">Queue Preview</p>
        </div>
        <button
          type="button"
          onClick={next}
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40"
        >
          Skip
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {upcoming.map((track, index) => {
            const mood = MOOD_CONFIG[track.mood];
            return (
              <motion.div
                key={`${track.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm"
              >
                <span
                  className="h-9 w-9 flex-shrink-0 rounded-2xl text-center text-lg"
                  style={{
                    background: mood.accentMuted,
                    lineHeight: "2.25rem",
                  }}
                  aria-hidden="true"
                >
                  {mood.icon}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{track.title}</p>
                  <p className="text-xs text-white/70">
                    {track.artist} · {mood.label}
                  </p>
                </div>
                <span className="text-xs text-white/60">
                  {formatDuration(track.duration)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <p className="mt-4 text-xs text-white/60">
        Queue cycles automatically — {queue.length} tracks loaded from the{" "}
        {currentTrack?.mood
          ? MOOD_CONFIG[currentTrack.mood].label
          : "current"}{" "}
        crate.
      </p>
    </section>
  );
};
