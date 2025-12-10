"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { extractDominantColor } from "@/lib/extractImageColor";
import { incrementPlayCount, getTotalPlays } from "@/lib/playCountStorage";

export interface Track {
  title: string;
  description: string;
  imageSrc: string;
  audioSrc: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];
  playMode: "normal" | "repeat" | "shuffle";
  isLoading: boolean;
  backgroundColor: string;
  totalPlays: number;
  audioElement: HTMLAudioElement | null;
  play: (track: Track, index: number) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  playAll: () => void;
  togglePlayMode: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return context;
};

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [playMode, setPlayMode] = useState<"normal" | "repeat" | "shuffle">(
    "normal"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("rgba(0, 0, 0, 1)");
  const [totalPlays, setTotalPlays] = useState(50000);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const hasCountedRef = useRef(false);

  useEffect(() => {
    // Load initial total plays
    setTotalPlays(getTotalPlays());
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);

        // Count play after 30 seconds or 50% of track, whichever comes first
        if (!hasCountedRef.current && currentTrack) {
          const halfDuration = audio.duration / 2;
          const threshold = Math.min(30, halfDuration);

          if (audio.currentTime >= threshold) {
            incrementPlayCount(currentTrack.title);
            setTotalPlays(getTotalPlays());
            hasCountedRef.current = true;
            console.log(`Play counted for: ${currentTrack.title}`);
          }
        }

        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      hasCountedRef.current = false;
      if (playMode === "repeat") {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);

    animationFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playMode, currentTrack]);

  const play = async (track: Track, index: number) => {
    if (!audioRef.current || !track.audioSrc) return;

    // Reset play count flag for new track
    hasCountedRef.current = false;

    setIsLoading(true);
    setCurrentTrack(track);
    setCurrentTrackIndex(index);

    // Extract color from album art and set background
    try {
      console.log("Extracting color from:", track.imageSrc);
      const color = await extractDominantColor(track.imageSrc);
      console.log("Setting background color to:", color);
      setBackgroundColor(color);
    } catch (e) {
      console.error("Color extraction error:", e);
    }

    // Ensure audio source is properly set
    const audioSrc = track.audioSrc;
    console.log("Playing:", audioSrc);

    audioRef.current.src = audioSrc;
    audioRef.current.load();

    // Add a small delay to ensure loading
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Playback error:", err);
            setIsLoading(false);
          });
      }
    }, 100);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const next = () => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (playMode === "shuffle") {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    play(playlist[nextIndex], nextIndex);
  };

  const previous = () => {
    if (playlist.length === 0) return;

    if (currentTime > 3) {
      seek(0);
    } else {
      const prevIndex =
        currentTrackIndex - 1 < 0 ? playlist.length - 1 : currentTrackIndex - 1;
      play(playlist[prevIndex], prevIndex);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const playAll = () => {
    if (playlist.length > 0) {
      play(playlist[0], 0);
    }
  };

  const togglePlayMode = () => {
    const modes: Array<"normal" | "repeat" | "shuffle"> = [
      "normal",
      "repeat",
      "shuffle",
    ];
    const currentIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayMode(nextMode);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        currentTrackIndex,
        isPlaying,
        volume,
        currentTime,
        duration,
        playlist,
        playMode,
        isLoading,
        play,
        pause,
        resume,
        next,
        previous,
        seek,
        setVolume,
        setPlaylist,
        playAll,
        togglePlayMode,
        backgroundColor,
        totalPlays,
        audioElement: audioRef.current,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
