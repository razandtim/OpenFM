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
import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PREFERENCES_FILE = path.join(__dirname, '../../preferences.json');

export class StateManager extends EventEmitter {
  private state: PlaybackState;
  private settings: PlayerSettings;
  private library: LocalMood[] = [];
  private isOBSActive = false;

  constructor() {
    super();
    
    this.settings = getDefaultSettings();
    
    // Initialize state first
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
    
    // Load preferences from localStorage and restore volume/crossfade
    this.loadPreferencesFromStorage();
    
    // Restore volume and crossfade from settings
    if (this.settings.crossfadeDuration) {
      this.state.crossfadeDuration = this.settings.crossfadeDuration;
    }
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
    // Log state changes for debugging
    if (updates.currentTrack) {
      console.log('StateManager: Track set to', updates.currentTrack.title);
    }
    if (updates.isLoading !== undefined) {
      console.log('StateManager: isLoading set to', updates.isLoading);
    }
    this.emit('state:changed', this.state);
  }

  updateSettings(updates: Partial<PlayerSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.emit('settings:changed', this.settings);
    // Persist to file/localStorage
    this.savePreferencesSync();
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
    // Don't set isLoading to false here - let the playback manager control it
    this.updateState({ currentTrack: track });
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
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.updateState({ volume: clampedVolume });
    // Persist volume to file/localStorage
    this.savePreferencesSync();
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

  // Preferences with file-based persistence (Node.js) and localStorage (browser)
  async savePreferences(): Promise<UserPreferences> {
    const prefs: UserPreferences = {
      libraryRoot: (this as any).libraryRoot || undefined,
      settings: this.settings,
      audioPriorityOverrides: [],
    };
    
    // Also save volume and crossfade to preferences
    (prefs as any).volume = this.state.volume;
    (prefs as any).crossfadeDuration = this.state.crossfadeDuration;
    
    // Save to file (Node.js backend)
    try {
      await fs.writeFile(PREFERENCES_FILE, JSON.stringify(prefs, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving preferences to file:', error);
    }
    
    // Save to localStorage (browser environment)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('openfm:preferences', JSON.stringify(prefs));
      }
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
    
    return prefs;
  }
  
  // Synchronous version for compatibility
  savePreferencesSync(): UserPreferences {
    const prefs: UserPreferences = {
      libraryRoot: (this as any).libraryRoot || undefined,
      settings: this.settings,
      audioPriorityOverrides: [],
    };
    
    // Also save volume and crossfade to preferences
    (prefs as any).volume = this.state.volume;
    (prefs as any).crossfadeDuration = this.state.crossfadeDuration;
    
    // Save to file (Node.js backend) - synchronous
    try {
      fsSync.writeFileSync(PREFERENCES_FILE, JSON.stringify(prefs, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving preferences to file:', error);
    }
    
    return prefs;
  }

  loadPreferences(prefs: UserPreferences): void {
    if (prefs.settings) {
      this.updateSettings(prefs.settings);
    }
    if ((prefs as any).libraryRoot) {
      (this as any).libraryRoot = (prefs as any).libraryRoot;
    }
  }
  
  // Load preferences from file (Node.js) or localStorage (browser)
  loadPreferencesFromStorage(): void {
    try {
      // Try file-based storage first (Node.js backend)
      try {
        if (fsSync.existsSync(PREFERENCES_FILE)) {
          const stored = fsSync.readFileSync(PREFERENCES_FILE, 'utf-8');
          const prefs = JSON.parse(stored) as UserPreferences;
          this.loadPreferences(prefs);
          // Also restore volume and crossfade to state if they exist
          if (prefs.settings && this.state) {
            if ((prefs as any).volume !== undefined) {
              this.state.volume = (prefs as any).volume;
            }
            if (prefs.settings.crossfadeDuration !== undefined) {
              this.state.crossfadeDuration = prefs.settings.crossfadeDuration;
            }
          }
          return; // Successfully loaded from file
        }
      } catch (fileError) {
        // File doesn't exist or can't be read, try localStorage
      }
      
      // Try localStorage (browser environment)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('openfm:preferences');
        if (stored) {
          const prefs = JSON.parse(stored) as UserPreferences;
          this.loadPreferences(prefs);
          // Also restore volume and crossfade to state if they exist
          if (prefs.settings && this.state) {
            if ((prefs as any).volume !== undefined) {
              this.state.volume = (prefs as any).volume;
            }
            if (prefs.settings.crossfadeDuration !== undefined) {
              this.state.crossfadeDuration = prefs.settings.crossfadeDuration;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading preferences from storage:', error);
    }
  }
}

