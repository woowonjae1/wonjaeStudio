"use client";

import React from "react";
import Image from "next/image";

interface AlbumCardEnhancedProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year?: number;
  onPlay?: (id: string) => void;
  isPlaying?: boolean;
  size?: "small" | "medium" | "large";
}

export default function AlbumCardEnhanced({
  id,
  title,
  artist,
  coverUrl,
  year,
  onPlay,
  isPlaying = false,
  size = "medium",
}: AlbumCardEnhancedProps) {
  const sizeClasses = {
    small: "w-36",
    medium: "w-44",
    large: "w-56",
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(id);
    }
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 snap-start`}>
      <div className="card-base group p-3 hover:bg-[var(--bg-elevated-highlight)] transition-colors duration-300">
        {/* Cover Container */}
        <div className="relative aspect-square mb-3 rounded-md overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
          <Image
            src={coverUrl}
            alt={`${title} by ${artist}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 150px, 250px"
          />

          {/* Play Button Overlay */}
          <div
            className={`absolute bottom-2 right-2 transform transition-all duration-300 ${isPlaying ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"}`}
          >
            <button
              onClick={handlePlayClick}
              className="w-10 h-10 rounded-full bg-[var(--spotify-green)] text-black flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[var(--spotify-green-hover)] transition-all"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="min-h-[60px]">
          <h3 className="font-bold text-sm mb-1 truncate text-[var(--text-base)]">
            {title}
          </h3>
          <p className="text-xs text-[var(--text-subdued)] truncate line-clamp-2">
            {year && <span className="mr-1">{year} •</span>}
            {artist}
          </p>
        </div>
      </div>
    </div>
  );
}
