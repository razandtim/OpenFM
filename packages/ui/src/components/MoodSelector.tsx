import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { MOOD_CONFIG, MOOD_ORDER, type MoodId } from '@openfm/core';

export interface MoodSelectorProps {
  currentMood: MoodId;
  onMoodSelect: (mood: MoodId) => void;
  enabledMoods?: Set<MoodId>;
  isLoading?: boolean;
  isPlaying?: boolean;
  className?: string;
}

export function MoodSelector({
  currentMood,
  onMoodSelect,
  enabledMoods,
  isLoading,
  isPlaying,
  className,
}: MoodSelectorProps) {
  return (
    <section
      className={clsx(
        'rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-inner shadow-black/30 backdrop-blur-xl',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
        <span>CHOOSE A MOOD</span>
        <span className="text-white/60">
          {isLoading ? 'Tuning...' : isPlaying ? 'Live' : 'PAUSED'}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {MOOD_ORDER.map((mood) => {
          const config = MOOD_CONFIG[mood];
          const isActive = currentMood === mood;
          const isEnabled = !enabledMoods || enabledMoods.has(mood);

          return (
            <MoodCard
              key={mood}
              mood={mood}
              config={config}
              isActive={isActive}
              isEnabled={isEnabled}
              onSelect={() => onMoodSelect(mood)}
            />
          );
        })}
      </div>
    </section>
  );
}

interface MoodCardProps {
  mood: MoodId;
  config: typeof MOOD_CONFIG[MoodId];
  isActive: boolean;
  isEnabled: boolean;
  onSelect: () => void;
}

function MoodCard({ mood, config, isActive, isEnabled, onSelect }: MoodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isEnabled}
      className={clsx(
        'relative flex min-w-[200px] flex-col items-start justify-center overflow-hidden rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        isActive && isEnabled
          ? 'border-white/30 bg-white/10 shadow-lg'
          : isEnabled
          ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
          : 'cursor-not-allowed border-white/5 bg-white/2 opacity-40'
      )}
      aria-pressed={isActive}
      aria-disabled={!isEnabled}
    >
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="mood-highlight"
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${config.color}40, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <p className="font-semibold text-white">{config.label}</p>
          <p className="text-xs text-white/60">/ {config.tagline}</p>
        </div>
      </div>
    </button>
  );
}

