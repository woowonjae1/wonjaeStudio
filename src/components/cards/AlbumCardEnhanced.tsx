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
    small: "w-40",
    medium: "w-48",
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
      <div className="spotify-card group p-4 transition-all hover:bg-[var(--bg-elevated-highlight)]">
        {/* 封面容器 */}
        <div className="album-cover-container mb-4 relative">
          <Image
            src={coverUrl}
            alt={`${title} by ${artist}`}
            width={240}
            height={240}
            className="album-cover w-full"
            loading="lazy"
          />

          {/* 播放按钮叠加层 */}
          <div className="play-overlay">
            <button
              onClick={handlePlayClick}
              className="btn-play shadow-xl"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 信息 */}
        <div>
          <h3 className="font-semibold text-base mb-1 truncate group-hover:text-[var(--spotify-green)] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-subdued)] truncate">
            {year && `${year} · `}
            {artist}
          </p>
        </div>
      </div>
    </div>
  );
}
