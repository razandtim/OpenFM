import React, { useState } from 'react';
import clsx from 'clsx';
import { X, RefreshCw, Save, Trash } from 'lucide-react';
import type { PlayerSettings } from '@openfm/core';

export interface SettingsProps {
  settings: PlayerSettings;
  onSettingsChange: (settings: Partial<PlayerSettings>) => void;
  onClose: () => void;
  libraryRoot?: string;
  onLibraryRootChange?: (path: string) => void;
  onLibraryRescan?: () => void;
  sunoApiKey?: string;
  onSunoApiKeyChange?: (key: string) => void;
  audioPriorityOverrides?: string[];
  onAudioPriorityChange?: (sources: string[]) => void;
  availableOBSSources?: string[];
  className?: string;
}

export function Settings({
  settings,
  onSettingsChange,
  onClose,
  libraryRoot,
  onLibraryRootChange,
  onLibraryRescan,
  sunoApiKey,
  onSunoApiKeyChange,
  audioPriorityOverrides = [],
  onAudioPriorityChange,
  availableOBSSources = [],
  className,
}: SettingsProps) {
  const [tab, setTab] = useState<'general' | 'audio' | 'library' | 'suno'>('general');
  const [tempApiKey, setTempApiKey] = useState(sunoApiKey || '');

  return (
    <div
      className={clsx(
        'flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/95 text-white backdrop-blur-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <h2 className="text-xl font-bold">Settings</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close settings"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 px-6">
        {(['general', 'audio', 'library', 'suno'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'border-b-2 px-4 py-3 text-sm font-medium transition',
              tab === t
                ? 'border-accent text-accent'
                : 'border-transparent text-white/60 hover:text-white'
            )}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'general' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Playback Mode</label>
              <select
                value={settings.playbackMode}
                onChange={(e) =>
                  onSettingsChange({
                    playbackMode: e.target.value as 'shuffle' | 'random',
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="shuffle">Shuffle (bag)</option>
                <option value="random">Random (with replacement)</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Loop</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.loop}
                onClick={() => onSettingsChange({ loop: !settings.loop })}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition',
                  settings.loop ? 'bg-accent' : 'bg-white/20'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                    settings.loop ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Overlay</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showOverlay}
                onClick={() =>
                  onSettingsChange({ showOverlay: !settings.showOverlay })
                }
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition',
                  settings.showOverlay ? 'bg-accent' : 'bg-white/20'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                    settings.showOverlay ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </label>
          </div>
        )}

        {tab === 'audio' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Crossfade Duration</label>
                <span className="text-sm text-white/60">
                  {settings.crossfadeDuration}ms
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={settings.crossfadeDuration}
                onChange={(e) =>
                  onSettingsChange({ crossfadeDuration: Number(e.target.value) })
                }
                className="w-full accent-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Target Volume</label>
                <span className="text-sm text-white/60">
                  {settings.targetVolume} dB
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="0"
                step="1"
                value={settings.targetVolume}
                onChange={(e) =>
                  onSettingsChange({ targetVolume: Number(e.target.value) })
                }
                className="w-full accent-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Duck Level</label>
                <span className="text-sm text-white/60">{settings.duckLevel} dB</span>
              </div>
              <input
                type="range"
                min="-40"
                max="0"
                step="1"
                value={settings.duckLevel}
                onChange={(e) =>
                  onSettingsChange({ duckLevel: Number(e.target.value) })
                }
                className="w-full accent-accent"
              />
            </div>

            {availableOBSSources.length > 0 && onAudioPriorityChange && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Audio Priority Overrides</label>
                <p className="text-xs text-white/60">
                  Select OBS sources that should duck OpenFM audio
                </p>
                <div className="space-y-2">
                  {availableOBSSources.map((source) => (
                    <label
                      key={source}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <input
                        type="checkbox"
                        checked={audioPriorityOverrides.includes(source)}
                        onChange={(e) => {
                          const newOverrides = e.target.checked
                            ? [...audioPriorityOverrides, source]
                            : audioPriorityOverrides.filter((s) => s !== source);
                          onAudioPriorityChange(newOverrides);
                        }}
                        className="h-4 w-4 accent-accent"
                      />
                      <span className="text-sm">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'library' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Library Root Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={libraryRoot || ''}
                  onChange={(e) => onLibraryRootChange?.(e.target.value)}
                  placeholder="/path/to/music/library"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                {onLibraryRescan && (
                  <button
                    type="button"
                    onClick={onLibraryRescan}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Rescan
                  </button>
                )}
              </div>
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-rescan</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.autoRescan}
                onClick={() =>
                  onSettingsChange({ autoRescan: !settings.autoRescan })
                }
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition',
                  settings.autoRescan ? 'bg-accent' : 'bg-white/20'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                    settings.autoRescan ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </label>
          </div>
        )}

        {tab === 'suno' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Suno API Key</label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <p className="text-xs text-white/60">
                Get your API key from{' '}
                <a
                  href="https://sunoapi.org/api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  sunoapi.org/api-key
                </a>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSunoApiKeyChange?.(tempApiKey)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent/90"
            >
              <Save className="h-4 w-4" />
              Save API Key
            </button>

            {sunoApiKey && (
              <button
                type="button"
                onClick={() => {
                  onSunoApiKeyChange?.('');
                  setTempApiKey('');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                <Trash className="h-4 w-4" />
                Clear API Key
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

