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

      // Add other tracks to queue
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
    <div
      className="card-base group p-4 hover:bg-[var(--bg-elevated-highlight)] transition-colors duration-300"
      onClick={onClick}
    >
      {/* Album Cover */}
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
        <Image
          src={album.coverUrl}
          alt={album.title}
          fill
          className="object-cover"
          loading="lazy"
          quality={85}
          sizes="(max-width: 768px) 150px, 250px"
        />

        {/* Play Button Overlay */}
        <div className="absolute bottom-2 right-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handlePlayAlbum}
            className="w-12 h-12 rounded-full bg-[var(--spotify-green)] text-black flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[var(--spotify-green-hover)] transition-all"
            aria-label={`Play ${album.title}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="min-h-[60px]">
        <h3 className="font-bold text-base mb-1 truncate text-[var(--text-base)] group-hover:text-[var(--text-base)]">
          {album.title}
        </h3>
        <p className="text-sm text-[var(--text-subdued)] truncate">
          {album.year} · {album.artist}
        </p>
      </div>
    </div>
  );
}
