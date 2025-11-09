/**
 * Playback Manager - Handles desktop audio playback
 */

import type { Track, MoodId } from '@openfm/core';
import { createQueue, type QueueType } from '@openfm/core';
import type { StateManager } from '../state/manager.js';

export class PlaybackManager {
  private stateManager: StateManager;
  private queue: QueueType | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.stateManager.on('playback:mood-changed', (mood: MoodId) => {
      console.log(`Mood changed to: ${mood}`);
      // Remember if we were playing before mood change
      const wasPlaying = this.stateManager.getState().isPlaying;
      
      // Clear current track and queue to force reload, but keep isPlaying state
      this.stateManager.updateState({ 
        currentTrack: undefined, 
        queue: [],
        isLoading: true,
        // Keep isPlaying state so new track will auto-play if we were playing
      });
      this.queue = null; // Clear queue
      
      // Load new mood
      this.loadMood(mood, wasPlaying)
        .catch((err) => {
          console.error('Error loading mood:', err);
          this.stateManager.updateState({ isLoading: false, isPlaying: false });
        });
    });

    this.stateManager.on('playback:play', () => {
      this.resumePlayback();
    });

    this.stateManager.on('playback:pause', () => {
      this.pausePlayback();
    });

    this.stateManager.on('playback:next', () => {
      this.playNext();
    });

    this.stateManager.on('playback:previous', () => {
      this.playPrevious();
    });

    this.stateManager.on('playback:mute', () => {
      this.setMuted(true);
    });

    this.stateManager.on('playback:unmute', () => {
      this.setMuted(false);
    });

    this.stateManager.on('obs:active', (active: boolean) => {
      if (active) {
        // OBS is controlling playback, stop desktop audio
        this.pausePlayback();
      }
    });
  }

  private async loadMood(mood: MoodId, shouldAutoPlay: boolean = false): Promise<void> {
    let library = this.stateManager.getLibrary();
    
    // If library is empty, try to load from saved preferences
    if (library.length === 0) {
      console.log('Library is empty, checking for saved library root...');
      // The library should have been scanned on startup or via the UI
      // For now, just log a warning
      console.warn('Library is empty. Please scan the library first via Settings > Library > Rescan');
      this.stateManager.updateState({ isLoading: false, isPlaying: false });
      return;
    }
    
    const moodData = library.find((m) => m.id === mood);

    if (!moodData || moodData.tracks.length === 0) {
      console.warn(`No tracks found for mood: ${mood}. Library has ${library.length} moods.`);
      this.stateManager.updateState({ isLoading: false, isPlaying: false });
      return;
    }

    console.log(`Loading mood ${mood} with ${moodData.tracks.length} tracks (autoPlay: ${shouldAutoPlay})`);

    const settings = this.stateManager.getSettings();
    this.queue = createQueue(moodData.tracks, settings.playbackMode, settings.loop);

    // Immediately play next track (this will set the track and trigger audio loading)
    // If we should auto-play, set isPlaying to true so the new track starts playing when ready
    if (shouldAutoPlay) {
      this.stateManager.updateState({ isPlaying: true });
    }
    this.playNext();
  }

  private playNext(): void {
    if (!this.queue) return;

    const track = this.queue.next();
    if (!track) {
      console.warn('No more tracks in queue');
      return;
    }

    this.playTrack(track);
  }

  private playPrevious(): void {
    if (!this.queue) {
      // If no queue, restart current track
      const state = this.stateManager.getState();
      if (state.currentTrack) {
        this.playTrack(state.currentTrack);
      }
      return;
    }

    // Try to get previous track from queue
    const previousTrack = this.queue.previous();
    if (previousTrack) {
      this.playTrack(previousTrack);
    } else {
      // If no previous track, restart current track
      const state = this.stateManager.getState();
      if (state.currentTrack) {
        this.playTrack(state.currentTrack);
      }
    }
  }

  private playTrack(track: Track): void {
    // Check if track has a file path
    if (!track.filePath) {
      console.error('Track has no file path:', track);
      this.stateManager.updateState({ isLoading: false, isPlaying: false });
      return;
    }

    console.log(`Now playing: ${track.title} by ${track.artist} from ${track.filePath}`);

    // Update state - actual audio playback happens in the browser
    // The browser will listen to state changes and play audio via HTMLAudioElement
    // Set track and loading state - the audio player will clear loading when ready
    const currentState = this.stateManager.getState();
    
    // Set the new track with loading state, preserving the current isPlaying state
    this.stateManager.setTrack(track);
    this.stateManager.updateState({ 
      isLoading: true,
      // Keep the current isPlaying state - if it's true, the audio will auto-play when ready
      isPlaying: currentState.isPlaying,
    });

    // Auto-play will be handled by the audio player when it's ready
    // The audio player will try to play when canplay fires
  }

  private resumePlayback(): void {
    // Browser will handle actual playback
    this.stateManager.updateState({ isPlaying: true, isLoading: false });
  }

  private pausePlayback(): void {
    // Browser will handle actual playback
    this.stateManager.updateState({ isPlaying: false });
  }

  private setMuted(muted: boolean): void {
    this.stateManager.updateState({ isMuted: muted });
  }

  private startProgressUpdates(duration: number): void {
    // Progress updates are handled by the browser audio element
    // This is just a fallback timer
    this.stopProgressUpdates();
    
    let elapsed = 0;
    this.updateInterval = setInterval(() => {
      elapsed += 0.1;
      
      if (elapsed >= duration) {
        this.playNext();
      } else {
        this.stateManager.updateProgress(elapsed, duration);
      }
    }, 100);
  }

  private stopProgressUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  stop(): void {
    this.pausePlayback();
    this.stopProgressUpdates();
    // Audio playback is handled in the browser, so no cleanup needed here
  }
}

