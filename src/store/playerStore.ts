"use client";

import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioUrl: string;
  duration: number;
}

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  queue: Track[];

  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.7,
  queue: [],

  setCurrentTrack: (track) =>
    set({ currentTrack: track, isPlaying: true, currentTime: 0 }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setCurrentTime: (time) => set({ currentTime: time }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  next: () => {
    const { queue, currentTrack } = get();
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      set({ currentTrack: queue[nextIndex], currentTime: 0 });
    }
  },

  previous: () => {
    const { queue, currentTrack, currentTime } = get();

    // 如果播放超过3秒，重新开始当前曲目
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
      set({ currentTrack: queue[prevIndex], currentTime: 0 });
    }
  },

  addToQueue: (track) =>
    set((state) => ({
      queue: [...state.queue, track],
    })),
}));
