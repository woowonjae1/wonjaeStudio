"use client";

import React, { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import MusicPlayerBar from "@/components/player/MusicPlayerBar";
import AlbumCard from "@/components/music/AlbumCard";

export default function MusicPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  // 专辑数据 - 使用示例音频URL
  const albums = [
    {
      id: "1",
      title: "午夜电台",
      artist: "WooWonJae",
      coverUrl:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2023,
      genre: "电子",
      tracks: [
        {
          id: "1-1",
          title: "深夜思绪",
          duration: "3:45",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "1-2",
          title: "城市回声",
          duration: "4:21",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        {
          id: "1-3",
          title: "星光下的对话",
          duration: "5:12",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
        {
          id: "1-4",
          title: "雨后",
          duration: "3:56",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        },
      ],
    },
    {
      id: "2",
      title: "记忆碎片",
      artist: "WooWonJae",
      coverUrl:
        "https://images.unsplash.com/photo-1581375383680- 7101dc5cb5f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2022,
      genre: "流行",
      tracks: [
        {
          id: "2-1",
          title: "旧照片",
          duration: "4:10",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        },
        {
          id: "2-2",
          title: "夏日午后",
          duration: "3:40",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        },
        {
          id: "2-3",
          title: "遗忘的角落",
          duration: "4:25",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        },
        {
          id: "2-4",
          title: "重逢",
          duration: "3:55",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        },
      ],
    },
    {
      id: "3",
      title: "城市之声",
      artist: "WooWonJae",
      coverUrl:
        "https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2021,
      genre: "嘻哈",
      tracks: [
        {
          id: "3-1",
          title: "都市节奏",
          duration: "3:25",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        },
        {
          id: "3-2",
          title: "霓虹灯下",
          duration: "4:05",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        },
        {
          id: "3-3",
          title: "黎明时分",
          duration: "3:50",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        },
        {
          id: "3-4",
          title: "地铁",
          duration: "4:15",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        },
      ],
    },
    {
      id: "4",
      title: "冬日故事",
      artist: "WooWonJae",
      coverUrl:
        "https://images.unsplash.com/photo-1461784180009-21121be2d29e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2020,
      genre: "民谣",
      tracks: [
        {
          id: "4-1",
          title: "雪夜",
          duration: "4:30",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        },
        {
          id: "4-2",
          title: "炉火",
          duration: "3:55",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        },
        {
          id: "4-3",
          title: "远山",
          duration: "5:10",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        },
        {
          id: "4-4",
          title: "归途",
          duration: "4:45",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
        },
      ],
    },
  ];

  return (
    <>
      <Navigation />
      <MusicPlayerBar />

      <div className="min-h-screen bg-[var(--bg-base)] pt-16 pb-24">
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
                  onClick={() =>
                    setSelectedAlbum(
                      selectedAlbum === album.id ? null : album.id
                    )
                  }
                >
                  <AlbumCard album={album} />
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

                    <div className="space-y-1">
                      {album.tracks.map((track, idx) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 p-3 rounded hover:bg-[var(--bg-elevated-highlight)] group transition-colors cursor-pointer"
                        >
                          <span className="text-sm text-[var(--text-subdued)] w-8 text-right">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate group-hover:text-[var(--spotify-green)] transition-colors">
                              {track.title}
                            </p>
                            <p className="text-sm text-[var(--text-subdued)] truncate">
                              {album.artist}
                            </p>
                          </div>
                          <span className="text-sm text-[var(--text-subdued)] font-mono">
                            {track.duration}
                          </span>
                        </div>
                      ))}
                    </div>
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
    </>
  );
}
