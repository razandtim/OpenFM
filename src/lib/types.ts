export type MoodId = "romantic" | "funny" | "scary" | "epic" | "sad";

export interface MoodConfig {
  id: MoodId;
  label: string;
  tagline: string;
  accent: string;
  accentMuted: string;
  chip: string;
  glow: string;
  icon: string;
  microcopy: string[];
}

export interface Track {
  id: string;
  mood: MoodId;
  title: string;
  artist: string;
  duration: number; // seconds
  description: string;
  session: string;
  story: string;
  audioSrc: string;
  artworkGradient: [string, string];
}
