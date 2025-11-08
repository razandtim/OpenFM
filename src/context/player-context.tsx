"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { MoodId, Track } from "@/lib/types";
import { buildQueueForMood, upcomingFromQueue } from "@/lib/playlist";
import { getMoodCopy } from "@/lib/moods";

type PlayerContextValue = {
  currentMood: MoodId;
  moodMessage: string;
  currentTrack: Track | null;
  queue: Track[];
  upcoming: Track[];
  isPlaying: boolean;
  isLoading: boolean;
  elapsed: number;
  duration: number;
  progress: number;
  setMood: (mood: MoodId) => void;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  next: () => void;
  previous: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayRef = useRef(false);

  const [currentMood, setCurrentMood] = useState<MoodId>("epic");
  const [queue, setQueue] = useState<Track[]>(() =>
    buildQueueForMood("epic"),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [moodMessage, setMoodMessage] = useState(getMoodCopy("epic"));

  const currentTrack = queue[activeIndex] ?? null;

  const syncMood = useCallback(
    (nextMood: MoodId) => {
      autoplayRef.current = isPlaying;
      setCurrentMood(nextMood);
      setQueue(buildQueueForMood(nextMood));
      setActiveIndex(0);
      setElapsed(0);
      setDuration(0);
      setIsLoading(true);
      setMoodMessage(getMoodCopy(nextMood));
    },
    [isPlaying],
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    autoplayRef.current = true;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn("Playback failed", error);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    autoplayRef.current = false;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
      return;
    }
    await play();
  }, [isPlaying, pause, play]);

  const next = useCallback(() => {
    setIsLoading(true);
    setElapsed(0);
    setDuration(0);
    setActiveIndex((prev) => {
      if (prev < queue.length - 1) {
        return prev + 1;
      }
      const refill = buildQueueForMood(currentMood);
      setQueue(refill);
      return 0;
    });
  }, [queue.length, currentMood]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (activeIndex > 0) {
      setIsLoading(true);
      setElapsed(0);
      setDuration(0);
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [activeIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return undefined;

    const handleCanPlay = () => {
      setDuration(Math.floor(audio.duration || currentTrack.duration));
      setIsLoading(false);
      if (autoplayRef.current) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    const target = audio;
    target.src = currentTrack.audioSrc;
    target.load();
    target.addEventListener("canplay", handleCanPlay);

    return () => {
      target.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrack]);

  useEffect(() => {
    const node = audioRef.current;
    return () => {
      if (!node) return;
      node.pause();
      node.src = "";
    };
  }, []);

  const upcoming = useMemo(
    () => upcomingFromQueue(queue, activeIndex, 4),
    [queue, activeIndex],
  );

  const value: PlayerContextValue = {
    currentMood,
    moodMessage,
    currentTrack,
    queue,
    upcoming,
    isPlaying,
    isLoading,
    elapsed,
    duration,
    progress: duration ? elapsed / duration : 0,
    setMood: syncMood,
    play,
    pause,
    togglePlay,
    next,
    previous,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        className="sr-only"
        aria-hidden="true"
        onTimeUpdate={(event) =>
          setElapsed(Math.floor(event.currentTarget.currentTime))
        }
        onLoadedMetadata={(event) => {
          const raw = event.currentTarget.duration;
          const safeDuration = Number.isFinite(raw)
            ? raw
            : currentTrack?.duration ?? 0;
          setDuration(Math.floor(safeDuration));
        }}
        onEnded={next}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return context;
};
