// Shuffle and queue management

import type { Track } from './types';

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Bag shuffle - plays all tracks once before reshuffling
 * This is the "Shuffle" mode for Suno and Local
 */
export class BagShuffleQueue {
  private bag: Track[] = [];
  private allTracks: Track[];
  private loop: boolean;

  constructor(tracks: Track[], loop = true) {
    this.allTracks = tracks;
    this.loop = loop;
    this.refillBag();
  }

  private refillBag(): void {
    this.bag = shuffle([...this.allTracks]);
  }

  next(): Track | null {
    if (this.bag.length === 0) {
      if (!this.loop) return null;
      this.refillBag();
    }
    return this.bag.shift() || null;
  }

  peek(count: number): Track[] {
    const result: Track[] = [];
    const tempBag = [...this.bag];
    
    for (let i = 0; i < count; i++) {
      if (tempBag.length === 0) {
        if (!this.loop) break;
        tempBag.push(...shuffle([...this.allTracks]));
      }
      const track = tempBag.shift();
      if (track) result.push(track);
    }
    
    return result;
  }

  updateTracks(tracks: Track[]): void {
    this.allTracks = tracks;
    this.refillBag();
  }

  setLoop(loop: boolean): void {
    this.loop = loop;
  }

  remaining(): number {
    return this.bag.length;
  }
}

/**
 * Random queue - picks random tracks with replacement
 * This is the "Random" mode for Suno
 */
export class RandomQueue {
  private allTracks: Track[];
  private loop: boolean;

  constructor(tracks: Track[], loop = true) {
    this.allTracks = tracks;
    this.loop = loop;
  }

  next(): Track | null {
    if (this.allTracks.length === 0) return null;
    const index = Math.floor(Math.random() * this.allTracks.length);
    return this.allTracks[index];
  }

  peek(count: number): Track[] {
    if (this.allTracks.length === 0) return [];
    
    const result: Track[] = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * this.allTracks.length);
      result.push(this.allTracks[index]);
    }
    return result;
  }

  updateTracks(tracks: Track[]): void {
    this.allTracks = tracks;
  }

  setLoop(loop: boolean): void {
    this.loop = loop;
  }
}

export type QueueType = BagShuffleQueue | RandomQueue;

export function createQueue(
  tracks: Track[],
  mode: 'shuffle' | 'random',
  loop = true
): QueueType {
  return mode === 'shuffle'
    ? new BagShuffleQueue(tracks, loop)
    : new RandomQueue(tracks, loop);
}

