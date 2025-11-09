// Mood Configuration

import type { MoodConfig, MoodId } from './types';

export const MOOD_COLORS = {
  epic: '#4A5568', // Dark blue/purple from screenshot
  romantic: '#8B7355', // Warm brown from screenshot
  funny: '#2DD4BF', // Teal/turquoise from screenshot
  scary: '#9B2C2C', // Dark red from screenshot
  sad: '#63B3ED', // Light blue from screenshot
} as const;

// Background gradient colors for each mood
export const MOOD_BACKGROUNDS = {
  epic: 'linear-gradient(135deg, #2D3748 0%, #4A5568 50%, #1A202C 100%)', // Dark blue/purple gradient
  romantic: 'linear-gradient(135deg, #A68B5B 0%, #8B7355 50%, #6B5B4A 100%)', // Warm brown gradient
  funny: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #0D9488 100%)', // Teal/turquoise gradient
  scary: 'linear-gradient(135deg, #7F1D1D 0%, #9B2C2C 50%, #63171B 100%)', // Dark red gradient
  sad: 'linear-gradient(135deg, #4299E1 0%, #63B3ED 50%, #3182CE 100%)', // Light blue gradient
} as const;

export const MOOD_CONFIG: Record<MoodId, MoodConfig> = {
  epic: {
    id: 'epic',
    label: 'Epic',
    tagline: 'Arena-scale crescendos, stream-safe.',
    icon: '⚔️',
    color: MOOD_COLORS.epic,
    accentMuted: `${MOOD_COLORS.epic}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.epic}40, transparent 70%)`,
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    tagline: 'Slow-bloom textures wrapped in neon dusk.',
    icon: '💕',
    color: MOOD_COLORS.romantic,
    accentMuted: `${MOOD_COLORS.romantic}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.romantic}40, transparent 70%)`,
  },
  funny: {
    id: 'funny',
    label: 'Funny',
    tagline: 'Bouncy chip-pop and curious percussion.',
    icon: '😄',
    color: MOOD_COLORS.funny,
    accentMuted: `${MOOD_COLORS.funny}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.funny}40, transparent 70%)`,
  },
  scary: {
    id: 'scary',
    label: 'Scary',
    tagline: 'Dark ambience with pulse-raising drones.',
    icon: '👻',
    color: MOOD_COLORS.scary,
    accentMuted: `${MOOD_COLORS.scary}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.scary}40, transparent 70%)`,
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    tagline: 'Gentle downtempo reflections for late nights.',
    icon: '😢',
    color: MOOD_COLORS.sad,
    accentMuted: `${MOOD_COLORS.sad}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.sad}40, transparent 70%)`,
  },
};

export const MOOD_ORDER: MoodId[] = ['epic', 'romantic', 'funny', 'scary', 'sad'];

export function getMoodConfig(moodId: MoodId): MoodConfig {
  return MOOD_CONFIG[moodId];
}

export function getMoodColor(moodId: MoodId): string {
  return MOOD_COLORS[moodId];
}

