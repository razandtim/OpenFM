// Suno API adapter

import type { SunoTrack, Track } from './types';

export interface SunoConfig {
  apiKey: string;
  baseUrl?: string;
}

export class SunoAdapter {
  private baseUrl: string;
  private apiKey: string;
  private cachedTracks: SunoTrack[] = [];

  constructor(config: SunoConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.sunoapi.org/v1';
  }

  async fetchLibrary(): Promise<SunoTrack[]> {
    try {
      const response = await fetch(`${this.baseUrl}/songs`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.cachedTracks = this.parseSunoResponse(data);
      return this.cachedTracks;
    } catch (error) {
      console.error('Error fetching Suno library:', error);
      return [];
    }
  }

  private parseSunoResponse(data: any): SunoTrack[] {
    // Adapt based on actual Suno API response format
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id || String(Math.random()),
      title: item.title || item.name || 'Untitled',
      coverArt: item.cover_art || item.artwork,
      audioUrl: item.audio_url || item.url,
      duration: item.duration || 180,
    }));
  }

  convertToTracks(sunoTracks: SunoTrack[]): Track[] {
    return sunoTracks.map(track => ({
      id: `suno-${track.id}`,
      title: track.title,
      artist: 'Suno AI',
      mood: 'epic', // Suno tracks don't have mood, default to epic
      duration: track.duration,
      url: track.audioUrl,
      artwork: track.coverArt,
    }));
  }

  getCachedTracks(): SunoTrack[] {
    return this.cachedTracks;
  }

  async validateApiKey(): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/me`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { valid: true };
      } else {
        return { valid: false, error: `Invalid API key: ${response.statusText}` };
      }
    } catch (error) {
      return { valid: false, error: String(error) };
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }
}

export function getDefaultCoverArt(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23667eea" width="100" height="100"/%3E%3C/svg%3E';
}

