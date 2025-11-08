import type { MoodId, Track } from "@/lib/types";
import { getTracksForMood } from "@/data/tracks";

const shuffle = <T,>(items: T[]) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export const buildQueueForMood = (mood: MoodId): Track[] => {
  return shuffle(getTracksForMood(mood));
};

export const upcomingFromQueue = (
  queue: Track[],
  activeIndex: number,
  take = 3,
): Track[] => {
  const next = [];
  for (let i = activeIndex + 1; i < queue.length && next.length < take; i += 1) {
    next.push(queue[i]);
  }
  if (next.length < take) {
    const refill = buildQueueForMood(queue[activeIndex]?.mood ?? "epic");
    next.push(...refill.slice(0, take - next.length));
  }
  return next;
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
