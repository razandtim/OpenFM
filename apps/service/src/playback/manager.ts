/**
 * Playback Manager - Handles desktop audio playback
 */

import type { Track, MoodId } from '@openfm/core';
import { createQueue, type QueueType } from '@openfm/core';
import type { StateManager } from '../state/manager.js';

export class PlaybackManager {
  private stateManager: StateManager;
  private queue: QueueType | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private nextAudio: HTMLAudioElement | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.stateManager.on('playback:mood-changed', (mood: MoodId) => {
      this.loadMood(mood);
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

  private loadMood(mood: MoodId): void {
    const library = this.stateManager.getLibrary();
    const moodData = library.find((m) => m.id === mood);

    if (!moodData || moodData.tracks.length === 0) {
      console.warn(`No tracks found for mood: ${mood}`);
      return;
    }

    const settings = this.stateManager.getSettings();
    this.queue = createQueue(moodData.tracks, settings.playbackMode, settings.loop);
    
    const upcomingTracks = this.queue.peek(10);
    this.stateManager.setQueue(upcomingTracks);

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
    // For simplicity, restart current track
    // In a full implementation, maintain history
    const state = this.stateManager.getState();
    if (state.currentTrack) {
      this.playTrack(state.currentTrack);
    }
  }

  private playTrack(track: Track): void {
    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // In Node.js environment, we can't use HTMLAudioElement
    // This would need to use a native audio library like node-speaker or similar
    // For now, just update state
    this.stateManager.setTrack(track);
    this.stateManager.play();

    // Update queue preview
    if (this.queue) {
      const upcomingTracks = this.queue.peek(10);
      this.stateManager.setQueue(upcomingTracks);
    }

    // Start progress updates
    this.startProgressUpdates(track.duration);

    console.log(`Now playing: ${track.title} by ${track.artist}`);
  }

  private resumePlayback(): void {
    if (this.currentAudio) {
      this.currentAudio.play().catch((err) => {
        console.error('Error resuming playback:', err);
      });
    }
  }

  private pausePlayback(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    this.stopProgressUpdates();
  }

  private setMuted(muted: boolean): void {
    if (this.currentAudio) {
      this.currentAudio.muted = muted;
    }
  }

  private startProgressUpdates(duration: number): void {
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
    
    if (this.currentAudio) {
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    
    if (this.nextAudio) {
      this.nextAudio.src = '';
      this.nextAudio = null;
    }
  }
}

