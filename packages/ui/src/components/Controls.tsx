import React from 'react';
import clsx from 'clsx';

export interface ControlsProps {
  crossfadeDuration: number;
  onCrossfadeChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  showOverlay: boolean;
  onOverlayToggle: () => void;
  volume?: number;
  onVolumeChange?: (value: number) => void;
  className?: string;
}

export function Controls({
  crossfadeDuration,
  onCrossfadeChange,
  isMuted,
  onMuteToggle,
  showOverlay,
  onOverlayToggle,
  volume = 0.7,
  onVolumeChange,
  className,
}: ControlsProps) {
  return (
    <section
      className={clsx(
        'rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-inner shadow-black/30 backdrop-blur-xl',
        className
      )}
    >
      <div className="space-y-6">
        {/* Crossfade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="crossfade" className="text-sm font-medium">
              Crossfade
            </label>
            <span className="text-sm text-white/60">{crossfadeDuration}ms</span>
          </div>
          <input
            id="crossfade"
            type="range"
            min="0"
            max="1000"
            step="50"
            value={crossfadeDuration}
            onChange={(e) => onCrossfadeChange(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Volume */}
        {onVolumeChange && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="volume" className="text-sm font-medium">
                Volume
              </label>
              <span className="text-sm text-white/60">{Math.round(volume * 100)}%</span>
            </div>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        )}

        {/* Toggles */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onMuteToggle}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            {isMuted ? 'Unmute All' : 'Mute All'}
          </button>

          <label className="flex items-center gap-2">
            <span className="text-sm">Show Overlay</span>
            <button
              type="button"
              role="switch"
              aria-checked={showOverlay}
              onClick={onOverlayToggle}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                showOverlay ? 'bg-accent' : 'bg-white/20'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  showOverlay ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </label>
        </div>
      </div>
    </section>
  );
}

