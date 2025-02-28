import { useState, useCallback } from 'react';
import { Album } from '@/types';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: Album | null;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTrack: null,
  });

  const playTrack = useCallback((album: Album) => {
    setState({
      isPlaying: true,
      currentTrack: album,
    });
  }, []);

  const pauseTrack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  return {
    ...state,
    playTrack,
    pauseTrack,
    togglePlayPause,
  };
};