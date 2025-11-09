import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { MoodId, Track, PlaybackState, PlayerSettings } from '@openfm/core';
import { getDefaultSettings } from '@openfm/core';

export interface PlayerContextValue {
  // State
  state: PlaybackState;
  settings: PlayerSettings;
  
  // Actions
  setMood: (mood: MoodId) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setMode: (mode: 'local' | 'suno') => void;
  toggleMute: () => void;
  setCrossfade: (duration: number) => void;
  setVolume: (volume: number) => void;
  updateSettings: (settings: Partial<PlayerSettings>) => void;
  
  // API callbacks (to be implemented by service)
  onStateChange?: (state: PlaybackState) => void;
  onSettingsChange?: (settings: PlayerSettings) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export interface PlayerProviderProps {
  children: ReactNode;
  initialState?: Partial<PlaybackState>;
  initialSettings?: Partial<PlayerSettings>;
  onStateChange?: (state: PlaybackState) => void;
  onSettingsChange?: (settings: PlayerSettings) => void;
}

export function PlayerProvider({
  children,
  initialState,
  initialSettings,
  onStateChange,
  onSettingsChange,
}: PlayerProviderProps) {
  const [state, setState] = useState<PlaybackState>({
    mode: 'local',
    currentMood: 'epic',
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    elapsed: 0,
    duration: 0,
    progress: 0,
    volume: 0.7,
    crossfadeDuration: 250,
    queue: [],
    ...initialState,
  });

  const [settings, setSettings] = useState<PlayerSettings>({
    ...getDefaultSettings(),
    ...initialSettings,
  });

  const updateState = useCallback(
    (updates: Partial<PlaybackState>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  const updateSettings = useCallback(
    (updates: Partial<PlayerSettings>) => {
      setSettings((prev) => {
        const newSettings = { ...prev, ...updates };
        onSettingsChange?.(newSettings);
        return newSettings;
      });
    },
    [onSettingsChange]
  );

  const setMood = useCallback(
    (mood: MoodId) => {
      updateState({ currentMood: mood, isLoading: true });
    },
    [updateState]
  );

  const togglePlay = useCallback(() => {
    updateState({ isPlaying: !state.isPlaying });
  }, [state.isPlaying, updateState]);

  const next = useCallback(() => {
    updateState({ isLoading: true });
  }, [updateState]);

  const previous = useCallback(() => {
    updateState({ isLoading: true });
  }, [updateState]);

  const setMode = useCallback(
    (mode: 'local' | 'suno') => {
      updateState({ mode, isLoading: true });
    },
    [updateState]
  );

  const toggleMute = useCallback(() => {
    updateState({ isMuted: !state.isMuted });
  }, [state.isMuted, updateState]);

  const setCrossfade = useCallback(
    (duration: number) => {
      updateState({ crossfadeDuration: duration });
      updateSettings({ crossfadeDuration: duration });
    },
    [updateState, updateSettings]
  );

  const setVolume = useCallback(
    (volume: number) => {
      updateState({ volume });
    },
    [updateState]
  );

  const value: PlayerContextValue = {
    state,
    settings,
    setMood,
    togglePlay,
    next,
    previous,
    setMode,
    toggleMute,
    setCrossfade,
    setVolume,
    updateSettings,
    onStateChange,
    onSettingsChange,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

