"use client";

import React from "react";
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
}

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const { setCurrentTrack, addToQueue } = usePlayerStore();

  const handlePlayAlbum = () => {
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
    <div className="spotify-card group p-4 transition-all hover:bg-[var(--bg-elevated-highlight)]">
      {/* 专辑封面 */}
      <div className="album-cover-container relative mb-4">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-md"
        />

        {/* 播放按钮叠加层 */}
        <div className="play-overlay">
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
      <div className="space-y-1">
        <h3 className="font-bold truncate group-hover:text-[var(--text-base)] transition-colors">
          {album.title}
        </h3>
        <p className="text-sm text-[var(--text-subdued)] truncate">
          {album.year} · {album.artist}
        </p>
      </div>
    </div>
  );
}
