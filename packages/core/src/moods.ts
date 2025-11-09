// Mood Configuration

import type { MoodConfig, MoodId } from './types';

export const MOOD_COLORS = {
  epic: '#FF6B6B',
  romantic: '#FFC6E7',
  funny: '#FFE08A',
  scary: '#B28DFF',
  sad: '#7EC8E3',
} as const;

export const MOOD_CONFIG: Record<MoodId, MoodConfig> = {
  epic: {
    id: 'epic',
    label: 'Epic',
    tagline: 'Heroic anthems & soaring crescendos',
    icon: '⚔️',
    color: MOOD_COLORS.epic,
    accentMuted: `${MOOD_COLORS.epic}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.epic}40, transparent 70%)`,
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    tagline: 'Tender moments & heartfelt melodies',
    icon: '💕',
    color: MOOD_COLORS.romantic,
    accentMuted: `${MOOD_COLORS.romantic}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.romantic}40, transparent 70%)`,
  },
  funny: {
    id: 'funny',
    label: 'Funny',
    tagline: 'Quirky tunes & playful beats',
    icon: '😄',
    color: MOOD_COLORS.funny,
    accentMuted: `${MOOD_COLORS.funny}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.funny}40, transparent 70%)`,
  },
  scary: {
    id: 'scary',
    label: 'Scary',
    tagline: 'Eerie atmospheres & suspenseful strings',
    icon: '👻',
    color: MOOD_COLORS.scary,
    accentMuted: `${MOOD_COLORS.scary}33`,
    glow: `radial-gradient(circle, ${MOOD_COLORS.scary}40, transparent 70%)`,
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    tagline: 'Melancholic echoes & bittersweet ballads',
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

