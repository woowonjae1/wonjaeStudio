"use client";

import React from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";

interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  tracks: Track[];
  genre?: string;
}

interface AlbumCardProps {
  album: Album;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export default function AlbumCard({
  album,
  size = "medium",
  onClick,
}: AlbumCardProps) {
  const { setCurrentTrack, addToQueue } = usePlayerStore();

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (album.tracks.length > 0) {
      const firstTrack = album.tracks[0];
      const trackWithAlbumInfo = {
        id: firstTrack.id,
        title: firstTrack.title,
        artist: album.artist,
        albumCover: album.coverUrl,
        audioUrl: firstTrack.audioUrl,
        duration: parseDuration(firstTrack.duration),
      };

      setCurrentTrack(trackWithAlbumInfo);

      // 添加其他曲目到队列
      album.tracks.slice(1).forEach((track) => {
        addToQueue({
          id: track.id,
          title: track.title,
          artist: album.artist,
          albumCover: album.coverUrl,
          audioUrl: track.audioUrl,
          duration: parseDuration(track.duration),
        });
      });
    }
  };

  const parseDuration = (duration: string): number => {
    const [mins, secs] = duration.split(":").map(Number);
    return mins * 60 + secs;
  };

  return (
    <div className="album-card-enhanced" onClick={onClick}>
      {/* 专辑封面 */}
      <div className="album-card-cover-wrapper">
        <Image
          src={album.coverUrl}
          alt={album.title}
          width={300}
          height={300}
          className="album-card-cover"
          loading="lazy"
          quality={85}
        />

        {/* 播放按钮叠加层 */}
        <div className="album-card-play-overlay">
          <button
            onClick={handlePlayAlbum}
            className="btn-play shadow-lg"
            aria-label={`播放 ${album.title}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 专辑信息 */}
      <div className="album-card-info">
        <h3 className="album-card-title">{album.title}</h3>
        <p className="album-card-subtitle">
          {album.year} · {album.artist}
        </p>
      </div>
    </div>
  );
}
