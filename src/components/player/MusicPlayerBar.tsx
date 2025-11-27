"use client";

import React, { useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import Image from "next/image";

export default function MusicPlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    togglePlay,
    next,
    previous,
    setCurrentTime,
    setVolume,
  } = usePlayerStore();

  // Handle audio play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update current time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle audio ended
  const handleEnded = () => {
    next();
  };

  if (!currentTrack) {
    return null;
  }

  const duration = audioRef.current?.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 glass">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
            {/* Left: Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative w-14 h-14 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                <Image
                  src={currentTrack.albumCover}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <p className="text-sm font-medium truncate text-[var(--text-base)] hover:underline cursor-pointer">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[var(--text-subdued)] truncate hover:text-[var(--text-base)] cursor-pointer transition-colors">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Like Button */}
              <button
                className="btn-icon ml-2 hidden sm:flex"
                aria-label="Like"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
              <div className="flex items-center gap-6">
                {/* Shuffle (Optional) */}
                <button
                  className="btn-icon hidden md:flex"
                  aria-label="Shuffle"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <polyline points="21 16 21 21 16 21"></polyline>
                    <line x1="15" y1="15" x2="21" y2="21"></line>
                    <line x1="4" y1="4" x2="9" y2="9"></line>
                  </svg>
                </button>

                {/* Previous */}
                <button
                  onClick={previous}
                  className="btn-icon"
                  aria-label="Previous"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--text-base)] text-black hover:scale-105 transition-transform shadow-md"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Next */}
                <button onClick={next} className="btn-icon" aria-label="Next">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                {/* Repeat (Optional) */}
                <button className="btn-icon hidden md:flex" aria-label="Repeat">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full max-w-lg group">
                <span className="text-xs text-[var(--text-subdued)] font-mono w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="relative h-1 w-full bg-[var(--bg-elevated-press)] rounded-full cursor-pointer group-hover:h-1.5 transition-all"
                  onClick={handleSeek}
                >
                  <div
                    className="absolute h-full bg-[var(--text-base)] rounded-full group-hover:bg-[var(--spotify-green)] transition-colors"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Thumb (only visible on hover) */}
                  <div
                    className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-subdued)] font-mono w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right: Volume & Extra */}
            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
              <button className="btn-icon hidden md:flex" aria-label="Lyrics">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </button>

              <div className="flex items-center gap-2 group">
                <button
                  className="btn-icon"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                >
                  {volume > 0.5 ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  ) : volume > 0 ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  )}
                </button>

                <div className="w-24 h-1 bg-[var(--bg-elevated-press)] rounded-full cursor-pointer relative group-hover:w-28 transition-all">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="h-full bg-[var(--text-base)] rounded-full group-hover:bg-[var(--spotify-green)] transition-colors"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
