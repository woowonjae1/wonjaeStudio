import { useEffect } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    pause,
    resume,
    next,
    previous,
    volume,
    setVolume,
    togglePlayMode,
  } = useMusicPlayer();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            resume();
          }
          break;

        case "arrowright":
          e.preventDefault();
          next();
          break;

        case "arrowleft":
          e.preventDefault();
          previous();
          break;

        case "arrowup":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;

        case "arrowdown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;

        case "m":
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 0.7);
          break;

        case "l":
          e.preventDefault();
          togglePlayMode();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    isPlaying,
    pause,
    resume,
    next,
    previous,
    volume,
    setVolume,
    togglePlayMode,
  ]);
};
