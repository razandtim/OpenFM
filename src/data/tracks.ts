import type { Track, MoodId } from "@/lib/types";
import { MOOD_CONFIG } from "@/lib/moods";

export const MOODS: MoodId[] = ["epic", "romantic", "funny", "scary", "sad"];

const slugify = (fileName: string) =>
  fileName
    .replace(/\.(mp3|wav|ogg)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type TrackSeed = {
  file: string;
  title: string;
  duration?: number;
  artist?: string;
  session?: string;
  description?: string;
  story?: string;
  artworkGradient?: [string, string];
  audioSrc?: string;
};

type BaseMeta = {
  artist: string;
  session: string;
  description: string;
  story: (title: string) => string;
  duration: number;
  artworkGradient: [string, string];
};

const BASE_META: Record<MoodId, BaseMeta> = {
  epic: {
    artist: "Portal Vanguard",
    session: "Arena Echo Session",
    description: "Monumental cues built for cinematic hype.",
    story: (title) =>
      `${title} erupts from the Arena Echo Session — engineered for heroic raids and cinematic finales.`,
    duration: 246,
    artworkGradient: [MOOD_CONFIG.epic.accent, MOOD_CONFIG.epic.accentMuted],
  },
  romantic: {
    artist: "Velvet Streetlights",
    session: "Neon Dusk Recording",
    description: "Slow-bloom textures wrapped in late-night neon.",
    story: (title) =>
      `${title} glows from the Neon Dusk Recording — perfect for heart-on-sleeve chats and cozy raids.`,
    duration: 214,
    artworkGradient: [
      MOOD_CONFIG.romantic.accent,
      MOOD_CONFIG.romantic.accentMuted,
    ],
  },
  funny: {
    artist: "Circuit Parade",
    session: "Lo-Fi Laugh Lab",
    description: "Bouncy chip-pop and curious percussion loops.",
    story: (title) =>
      `${title} spilled out of the Lo-Fi Laugh Lab — prime fuel for chaos segments and meme-worthy moments.`,
    duration: 176,
    artworkGradient: [MOOD_CONFIG.funny.accent, MOOD_CONFIG.funny.accentMuted],
  },
  scary: {
    artist: "Nightfall Control",
    session: "Dread Signal Capture",
    description: "Pulse-raising drones with cinematic tension.",
    story: (title) =>
      `${title} seeped through the Dread Signal Capture — dial the lights down and let the chills settle.`,
    duration: 208,
    artworkGradient: [MOOD_CONFIG.scary.accent, MOOD_CONFIG.scary.accentMuted],
  },
  sad: {
    artist: "Blue Hour Broadcast",
    session: "Rainwave Diaries",
    description: "Gentle downtempo reflections for late nights.",
    story: (title) =>
      `${title} drifts from the Rainwave Diaries — ideal for calm co-working and after-stream unwinds.`,
    duration: 202,
    artworkGradient: [MOOD_CONFIG.sad.accent, MOOD_CONFIG.sad.accentMuted],
  },
};

const defineSeeds = (
  entries: Array<[string, string]>,
  startDuration: number,
  step: number,
): TrackSeed[] =>
  entries.map(([file, title], index) => ({
    file,
    title,
    duration: Math.max(90, Math.round(startDuration + index * step)),
  }));

const epicEntries: Array<[string, string]> = [
  ["bannerfall.wav", "Bannerfall"],
  ["chronicle-surge.wav", "Chronicle Surge"],
  ["crownfire.wav", "Crownfire"],
  ["empire-bloom.wav", "Empire Bloom"],
  ["myth-os.wav", "Myth OS"],
  ["nova-barrage.wav", "Nova Barrage"],
  ["obsidian-triumph.wav", "Obsidian Triumph"],
  ["solar-forge.wav", "Solar Forge"],
  ["titanium-choir.wav", "Titanium Choir"],
  ["volt-sky.wav", "Volt Sky"],
];

const romanticEntries: Array<[string, string]> = [
  ["Apricot_Dawn_2025-11-08T125926.mp3", "Apricot Dawn"],
  ["Borrowed_Constellations_2025-11-08T130742.mp3", "Borrowed Constellations"],
  ["Hand in a Hurricane.mp3", "Hand in a Hurricane"],
  ["Kiss Me in 3_4.mp3", "Kiss Me in 3/4"],
  ["Moonlight_on_Your_Sleeve_2025-11-08T124949.mp3", "Moonlight on Your Sleeve"],
  [
    "Paper_Rings_Wooden_Hearts_2025-11-08T131131.mp3",
    "Paper Rings, Wooden Hearts",
  ],
  ["Stolen_Glances_2025-11-08T124454.mp3", "Stolen Glances"],
  ["Sugar & Stars.mp3", "Sugar & Stars"],
  ["Two Cups of Silence.mp3", "Two Cups of Silence"],
  ["Velvet Skyline.mp3", "Velvet Skyline"],
];

const funnyEntries: Array<[string, string]> = [
  ["Algorithm Ate My Homework.mp3", "Algorithm Ate My Homework"],
  ["Banana_Peel_Ballet_2025-11-08T135658.mp3", "Banana Peel Ballet"],
  ["Cat Meeting at 3AM.mp3", "Cat Meeting at 3AM"],
  ["Grandma's VR Rollercoaster.mp3", "Grandma's VR Rollercoaster"],
  ["Laundry Day Disco.mp3", "Laundry Day Disco"],
  ["Left on Read (Oops My Bad).mp3", "Left on Read (Oops My Bad)"],
  ["Polka-Dot_Panic_2025-11-08T134715.mp3", "Polka-Dot Panic"],
  ["Sneaky_Snack_Heist_2025-11-08T135002.mp3", "Sneaky Snack Heist"],
  [
    "Spilled_My_Coffee_on_a_Zoom_Call_2025-11-08T134339.mp3",
    "Spilled My Coffee on a Zoom Call",
  ],
  ["Wi-Fi_Went_on_Vacation_2025-11-08T135211.mp3", "Wi-Fi Went on Vacation"],
];

const scaryEntries: Array<[string, string]> = [
  ["Basement_Door_at_317_2025-11-08T153547.mp3", "Basement Door at 3:17"],
  ["Blackwater_Ritual_2025-11-08T150054.mp3", "Blackwater Ritual"],
  ["Forest_of_Teeth_2025-11-08T154307.mp3", "Forest of Teeth"],
  ["Lurkers_Footsteps_2025-11-08T145508.mp3", "Lurker's Footsteps"],
  ["Mirror Game.mp3", "Mirror Game"],
  ["Static_on_Channel_7_2025-11-08T154045.mp3", "Static on Channel 7"],
  [
    "The_Thing_in_the_Cornfield_2025-11-08T145224.mp3",
    "The Thing in the Cornfield",
  ],
  ["Ward_C_Lights_Out_2025-11-08T150616.mp3", "Ward C: Lights Out"],
  ["Whispers_in_the_Walls_2025-11-08T144146.mp3", "Whispers in the Walls"],
];

const sadEntries: Array<[string, string]> = [
  ["afterglow-ledger.wav", "Afterglow Ledger"],
  ["blue-hour-drift.wav", "Blue Hour Drift"],
  ["dusk-module.wav", "Dusk Module"],
  ["hold-music-ghosts.wav", "Hold Music Ghosts"],
  ["late-fee-lullaby.wav", "Late Fee Lullaby"],
  ["november-kernel.wav", "November Kernel"],
  ["puddle-memory.wav", "Puddle Memory"],
  ["quiet-orbit.wav", "Quiet Orbit"],
  ["sleepless-pixel.wav", "Sleepless Pixel"],
  ["void-letters.wav", "Void Letters"],
];

const trackSeeds: Record<MoodId, TrackSeed[]> = {
  epic: defineSeeds(epicEntries, 240, 9),
  romantic: defineSeeds(romanticEntries, 206, 7),
  funny: defineSeeds(funnyEntries, 168, 5),
  scary: defineSeeds(scaryEntries, 212, 4),
  sad: defineSeeds(sadEntries, 198, 5),
};

const buildTrack = (mood: MoodId, seed: TrackSeed): Track => {
  const base = BASE_META[mood];
  const slug = slugify(seed.file);

  return {
    id: `${mood}-${slug}`,
    slug,
    mood,
    title: seed.title,
    artist: seed.artist ?? base.artist,
    duration: seed.duration ?? base.duration,
    description: seed.description ?? base.description,
    session: seed.session ?? base.session,
    story: seed.story ?? base.story(seed.title),
    audioSrc: seed.audioSrc ?? `/songs/${mood}/${seed.file}`,
    artworkGradient: seed.artworkGradient ?? base.artworkGradient,
  };
};

export const tracksByMood: Record<MoodId, Track[]> = MOODS.reduce(
  (acc, mood) => {
    acc[mood] = trackSeeds[mood].map((seed) => buildTrack(mood, seed));
    return acc;
  },
  {} as Record<MoodId, Track[]>,
);

export const getTracksForMood = (mood: MoodId): Track[] => tracksByMood[mood];
export const getPlaylist = (mood: MoodId): Track[] => getTracksForMood(mood);
export const allTracks = (): Track[] =>
  MOODS.flatMap((mood) => tracksByMood[mood]);
export const findTrack = (mood: MoodId, slug: string): Track | undefined =>
  tracksByMood[mood].find(
    (track) => track.slug === slug || track.id === slug,
  );

