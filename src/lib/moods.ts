import type { MoodConfig, MoodId } from "@/lib/types";

export const MOOD_ORDER: MoodId[] = [
  "epic",
  "romantic",
  "funny",
  "scary",
  "sad",
];

export const MOOD_CONFIG: Record<MoodId, MoodConfig> = {
  epic: {
    id: "epic",
    label: "Epic",
    tagline: "Arena-scale crescendos, stream-safe.",
    accent: "#5E60CE",
    accentMuted: "rgba(94, 96, 206, 0.25)",
    chip: "#31346E",
    glow: "rgba(114, 242, 235, 0.35)",
    icon: "🛡️",
    microcopy: [
      "Tuning into Epic waves...",
      "Priming the hero synth engines...",
      "Charging infinite hype cores...",
    ],
  },
  romantic: {
    id: "romantic",
    label: "Romantic",
    tagline: "Slow-bloom textures wrapped in neon dusk.",
    accent: "#F9C784",
    accentMuted: "rgba(249, 199, 132, 0.3)",
    chip: "#7A4C2F",
    glow: "rgba(249, 199, 132, 0.35)",
    icon: "💫",
    microcopy: [
      "Dimmed the lights for Romantic mode.",
      "Feathering in analog-soft chords...",
      "Velvet auras online.",
    ],
  },
  funny: {
    id: "funny",
    label: "Funny",
    tagline: "Bouncy chip-pop and curious percussion.",
    accent: "#72F2EB",
    accentMuted: "rgba(114, 242, 235, 0.35)",
    chip: "#1C4E53",
    glow: "rgba(114, 242, 235, 0.4)",
    icon: "🤹",
    microcopy: [
      "Loosening bolts for Funny FM.",
      "Cue the quirky bass squiggles...",
      "Comedy buffer filled.",
    ],
  },
  scary: {
    id: "scary",
    label: "Scary",
    tagline: "Dark ambience with pulse-raising drones.",
    accent: "#F04D4D",
    accentMuted: "rgba(240, 77, 77, 0.3)",
    chip: "#5C2222",
    glow: "rgba(240, 77, 77, 0.4)",
    icon: "🦂",
    microcopy: [
      "Brewing distant thunder...",
      "Cranking up the dread dimension...",
      "Fog machine engaged.",
    ],
  },
  sad: {
    id: "sad",
    label: "Sad",
    tagline: "Gentle downtempo reflections for late nights.",
    accent: "#72A0F5",
    accentMuted: "rgba(114, 160, 245, 0.35)",
    chip: "#1C2B4D",
    glow: "rgba(114, 160, 245, 0.35)",
    icon: "🌧️",
    microcopy: [
      "Clouding the booth with soft reverb...",
      "Soldering melancholic circuits...",
      "Rain-streak visuals incoming.",
    ],
  },
};

export const getMoodCopy = (mood: MoodId) => {
  const lines = MOOD_CONFIG[mood].microcopy;
  return lines[Math.floor(Math.random() * lines.length)];
};

export const MOOD_ROTATION: Array<{ time: string; mood: MoodId }> = [
  { time: "00:00", mood: "epic" },
  { time: "02:00", mood: "romantic" },
  { time: "04:00", mood: "funny" },
  { time: "06:00", mood: "sad" },
  { time: "08:00", mood: "epic" },
  { time: "10:00", mood: "scary" },
  { time: "12:00", mood: "funny" },
  { time: "14:00", mood: "romantic" },
  { time: "16:00", mood: "epic" },
  { time: "18:00", mood: "scary" },
  { time: "20:00", mood: "sad" },
  { time: "22:00", mood: "funny" },
];
