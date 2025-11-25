"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AlbumCard from "@/components/music/AlbumCard";
import TrackList from "@/components/music/TrackList";
import { usePlayerStore } from "@/store/playerStore";

export default function MusicPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const { setCurrentTrack, currentTrack } = usePlayerStore();

  // 真实专辑数据
  const albums = [
    {
      id: "1",
      title: "浪漫傍晚",
      artist: "WooWonJae",
      coverUrl: "/image/Romantic.jpg",
      year: 2024,
      genre: "R&B",
      tracks: [
        {
          id: "1-1",
          title: "傍晚的Romantic",
          duration: "4:20",
          audioUrl: "/audio/禹元宰 - 傍晚的Romantic.mp3",
        },
      ],
    },
    {
      id: "2",
      title: "Blue Groove",
      artist: "WooWonJae",
      coverUrl: "/image/iambluegroove.jpg",
      year: 2024,
      genre: "Hip-Hop",
      tracks: [
        {
          id: "2-1",
          title: "Can't Chat With You",
          duration: "3:45",
          audioUrl: "/audio/禹元宰 - [Free]#cant chat with you.mp3",
        },
      ],
    },
    {
      id: "3",
      title: "R&B Collection",
      artist: "WooWonJae",
      coverUrl: "/image/nobodygetsme.jpg",
      year: 2024,
      genre: "R&B",
      tracks: [
        {
          id: "3-1",
          title: "Nobody Gets Me Like You",
          duration: "4:05",
          audioUrl: "/audio/禹元宰 - Nobody Gets Me Like u R&B TYPE BEAT.mp3",
        },
      ],
    },
    {
      id: "4",
      title: "新篇章",
      artist: "WooWonJae",
      coverUrl: "/image/newalbum/woowonjae.jpg",
      year: 2024,
      genre: "R&B",
      tracks: [
        {
          id: "4-1",
          title: "Crush",
          duration: "3:30",
          audioUrl: "/audio/禹元宰 - Crush.mp3",
        },
      ],
    },
  ];

  const handleTrackClick = (track: any, album: any) => {
    setCurrentTrack({
      id: track.id,
      title: track.title,
      artist: album.artist,
      albumCover: album.coverUrl,
      audioUrl: track.audioUrl,
      duration: parseDuration(track.duration),
    });
  };

  const parseDuration = (duration: string): number => {
    const [mins, secs] = duration.split(":").map(Number);
    return mins * 60 + secs;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[var(--bg-base)] pt-8 pb-12">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">音乐作品</h1>
            <p className="text-lg text-[var(--text-subdued)]">
              探索音乐创作的无限可能
            </p>
          </header>

          {/* Albums Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">所有专辑</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AlbumCard
                    album={album}
                    onClick={() =>
                      setSelectedAlbum(
                        selectedAlbum === album.id ? null : album.id
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Track Listing - 显示选中专辑的曲目 */}
          {selectedAlbum && (
            <section className="animate-slide-up">
              {albums
                .filter((a) => a.id === selectedAlbum)
                .map((album) => (
                  <div
                    key={album.id}
                    className="bg-[var(--bg-elevated-base)] rounded-lg p-6"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-48 h-48 rounded-md shadow-lg"
                      />
                      <div>
                        <h2 className="text-4xl font-bold mb-2">
                          {album.title}
                        </h2>
                        <p className="text-lg text-[var(--text-subdued)] mb-2">
                          {album.artist} · {album.year} · {album.genre}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {album.tracks.length} 首歌曲
                        </p>
                      </div>
                    </div>

                    <TrackList
                      tracks={album.tracks.map((t) => ({
                        ...t,
                        artist: album.artist,
                      }))}
                      currentTrackId={currentTrack?.id}
                      onTrackClick={(track) => handleTrackClick(track, album)}
                    />
                  </div>
                ))}
            </section>
          )}

          {/* Music Philosophy */}
          <section className="mt-16 max-w-4xl mx-auto">
            <div className="bg-[var(--bg-elevated-base)] rounded-2xl p-8 border border-[var(--decorative-subdued)]">
              <h2 className="text-2xl font-bold mb-6">音乐创作理念</h2>

              <div className="space-y-4 text-[var(--text-subdued)]">
                <p>
                  音乐对我而言是情感的直接表达。我的创作灵感来源于城市生活、自然风景以及人际关系中的微妙情感。
                  我尝试将传统音乐元素与现代电子音乐技术相结合，创造出独特的音乐体验。
                </p>
                <p>每一首歌都是一次情感的旅程，希望能与听众产生共鸣。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
