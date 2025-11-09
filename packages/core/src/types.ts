// Core Types for OpenFM

export type MoodId = 'epic' | 'romantic' | 'funny' | 'scary' | 'sad';

export interface MoodConfig {
  id: MoodId;
  label: string;
  tagline: string;
  icon: string;
  color: string;
  accentMuted: string;
  glow: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  mood: MoodId;
  duration: number; // seconds
  filePath?: string; // for local tracks
  url?: string; // for Suno tracks
  artwork?: string;
  artworkGradient?: [string, string];
  session?: string;
  story?: string;
}

export interface LocalMood {
  id: MoodId;
  name: string;
  path: string;
  artwork?: string;
  tracks: Track[];
  enabled: boolean;
}

export interface LibraryConfig {
  rootPath: string;
  autoRescan: boolean;
  moods: LocalMood[];
}

export interface PlaybackState {
  mode: 'local' | 'suno';
  currentMood?: MoodId;
  currentTrack?: Track;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  elapsed: number;
  duration: number;
  progress: number;
  volume: number; // 0-1
  crossfadeDuration: number; // ms
  queue: Track[];
}

export interface PlayerSettings {
  crossfadeDuration: number; // default 250ms
  targetVolume: number; // default -10 dB
  duckLevel: number; // default -20 dB
  duckAttack: number; // default 10ms
  duckRelease: number; // default 250ms
  autoRescan: boolean;
  showOverlay: boolean;
  playbackMode: 'shuffle' | 'random';
  loop: boolean;
}

export interface UserPreferences {
  libraryRoot?: string;
  settings: PlayerSettings;
  sunoApiKey?: string;
  sunoBaseUrl?: string;
  audioPriorityOverrides: string[]; // OBS source names
}

export interface SunoTrack {
  id: string;
  title: string;
  coverArt?: string;
  audioUrl: string;
  duration: number;
}

export interface OpenFMTokens {
  mode: 'local' | 'suno';
  mood: string;
  song: string;
  status: 'playing' | 'muted' | 'paused';
  crossfade: string;
}

