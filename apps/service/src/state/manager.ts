/**
 * State Manager - Central state management for OpenFM
 */

import type {
  PlaybackState,
  PlayerSettings,
  UserPreferences,
  MoodId,
  Track,
  LocalMood,
} from '@openfm/core';
import { getDefaultSettings } from '@openfm/core';
import { EventEmitter } from 'events';

export class StateManager extends EventEmitter {
  private state: PlaybackState;
  private settings: PlayerSettings;
  private library: LocalMood[] = [];
  private isOBSActive = false;

  constructor() {
    super();
    
    this.state = {
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
    };

    this.settings = getDefaultSettings();
  }

  // State getters
  getState(): PlaybackState {
    return { ...this.state };
  }

  getSettings(): PlayerSettings {
    return { ...this.settings };
  }

  getLibrary(): LocalMood[] {
    return this.library;
  }

  isOBSControlActive(): boolean {
    return this.isOBSActive;
  }

  // State setters
  updateState(updates: Partial<PlaybackState>): void {
    this.state = { ...this.state, ...updates };
    this.emit('state:changed', this.state);
  }

  updateSettings(updates: Partial<PlayerSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.emit('settings:changed', this.settings);
  }

  setLibrary(library: LocalMood[]): void {
    this.library = library;
    this.emit('library:changed', library);
  }

  setOBSActive(active: boolean): void {
    this.isOBSActive = active;
    this.emit('obs:active', active);
  }

  // Playback controls
  setMood(mood: MoodId): void {
    this.updateState({ currentMood: mood, isLoading: true });
    this.emit('playback:mood-changed', mood);
  }

  setTrack(track: Track): void {
    this.updateState({ currentTrack: track, isLoading: false });
    this.emit('playback:track-changed', track);
  }

  setQueue(queue: Track[]): void {
    this.updateState({ queue });
  }

  play(): void {
    this.updateState({ isPlaying: true });
    this.emit('playback:play');
  }

  pause(): void {
    this.updateState({ isPlaying: false });
    this.emit('playback:pause');
  }

  togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next(): void {
    this.emit('playback:next');
  }

  previous(): void {
    this.emit('playback:previous');
  }

  mute(): void {
    this.updateState({ isMuted: true });
    this.emit('playback:mute');
  }

  unmute(): void {
    this.updateState({ isMuted: false });
    this.emit('playback:unmute');
  }

  toggleMute(): void {
    if (this.state.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  setVolume(volume: number): void {
    this.updateState({ volume: Math.max(0, Math.min(1, volume)) });
  }

  updateProgress(elapsed: number, duration: number): void {
    const progress = duration > 0 ? elapsed / duration : 0;
    this.updateState({ elapsed, duration, progress });
  }

  // Mode switching
  setMode(mode: 'local' | 'suno'): void {
    this.updateState({ mode, isLoading: true });
    this.emit('playback:mode-changed', mode);
  }

  // Preferences
  savePreferences(): UserPreferences {
    return {
      libraryRoot: undefined, // Loaded from config
      settings: this.settings,
      audioPriorityOverrides: [],
    };
  }

  loadPreferences(prefs: UserPreferences): void {
    if (prefs.settings) {
      this.updateSettings(prefs.settings);
    }
  }
}

