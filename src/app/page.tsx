'use client';

import React, { useState, useRef } from "react";
import { Album } from "@/types";
import Header from "@/components/layout/Header";
import AlbumGrid from "@/components/album/AlbumGrid";
import AudioPlayer from "@/components/audio/AudioPlayer";
import ImageSlider from "@/components/ImageSlider";
import NotificationBanner from "@/components/NotificationBanner";
import { ALBUMS, PLAYERS, MATCHES } from "@/utils/constants";
import CodeShowcase from '@/components/CodeShowcase';
import Image from 'next/image';
import PlayerGrid from '@/components/PlayerGrid';
import MatchSchedule from '@/components/MatchSchedule';
import GradientText from '@/components/GradientText';

// 使用 Next.js 的数据获取方法
export const revalidate = 3600; // 每小时重新验证一次

export default function Home() {
  const [audioState, setAudioState] = useState({
    currentAlbum: null as Album | null,
    isPlaying: false,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAlbum = (album: Album) => {
    if (audioState.currentAlbum?.id === album.id) {
      if (audioRef.current) {
        if (audioState.isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setAudioState(prev => ({
          ...prev,
          isPlaying: !prev.isPlaying
        }));
      }
    } else {
      setAudioState({
        currentAlbum: album,
        isPlaying: true
      });
      
      if (audioRef.current) {
        audioRef.current.src = album.audioSrc;
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <NotificationBanner onPlayAlbum={handlePlayAlbum} />
        <ImageSlider />
        <main className="container mx-auto px-4 pb-24">
          <section id="albums" className="py-12">
            <h2 className="text-3xl font-bold mb-6">My Albums</h2>
            <AlbumGrid 
              albums={ALBUMS}
              onPlayAlbum={handlePlayAlbum}
              currentAlbum={audioState.currentAlbum}
              isPlaying={audioState.isPlaying}
            />
          </section>

          <section id="code" className="py-12">
            <h2 className="text-3xl font-bold mb-4">Code</h2>
            <p className="text-gray-700 mb-8">
              Explore my coding projects and technical experiments. I love creating interactive experiences and useful tools.
            </p>
            <CodeShowcase />
          </section>

          <section id="manchester-city" className="py-12">
            <div className="w-full bg-[#6CABDD] mb-6 rounded-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center space-x-4">
                  <Image 
                    src="/image/manchester_city_logo.jpg"
                    alt="Manchester City Logo"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <h2 className="text-2xl font-bold text-white">Manchester City</h2>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-8">
              Manchester City Football Club, commonly referred to as Man City, is a professional football club based in Manchester, England. Founded in 1880, the club has a rich history and has become one of the most successful teams in recent years.
            </p>

            <h3 className="text-2xl font-bold mb-6">First Team Players</h3>
            <PlayerGrid players={PLAYERS} />
            
            <div className="mt-12">
              <MatchSchedule matches={MATCHES} />
            </div>
          </section>

          <section id="game" className="py-12">
            <h2 className="text-3xl font-bold mb-4">Game</h2>
            
            <p className="text-gray-700 mb-4">
              Check out my game development projects and gaming content. From design to implementation, I enjoy creating engaging experiences.
            </p>

            {/* 添加 GradientText 组件 */}
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={true}
              className="mb-6 text-5xl border-2 border-transparent" // 添加边框样式
            >
              King of FPS Game
            </GradientText>
          </section>

          <section id="music" className="py-12 relative min-h-[800px]">
            {/* 浮动背景图 - 限制在特定区域内 */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  left: '5%',
                  top: '15%',
                  width: '200px',
                  height: '200px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-30 object-contain"
                />
              </div>
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 10s ease-in-out infinite',
                  right: '10%',
                  top: '30%',
                  width: '160px',
                  height: '160px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-25 object-contain"
                />
              </div>
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 7s ease-in-out infinite',
                  left: '25%',
                  top: '45%',
                  width: '120px',
                  height: '120px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-20 object-contain"
                />
              </div>
            </div>

            <div className="relative z-10"> {/* 包装内容以确保在浮动图片上方 */}
              <h2 className="text-3xl font-bold mb-4">Music Production</h2>
              
              {/* Banner 模块 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="relative w-full" style={{ paddingTop: '50%' }}> {/* 调整为 2:1 的宽高比 */}
                  <Image
                    src="/image/Wyy.jpg"
                    alt="Music Production Banner"
                    fill
                    className="object-contain object-center scale-125" // 添加 scale-125 使图片放大 25%
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="container mx-auto">
                      <h3 className="text-2xl font-bold mb-1 text-white">Music Studio</h3>
                      <div className="flex items-center space-x-2 text-sm text-white/90">
                        <span>Professional Music Production Environment</span>
                        <span>•</span>
                        <span>禹元宰52hz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Explore my music production tips, tutorials, and projects. 
                    Here you'll find insights into my creative process, production techniques, 
                    and the latest tracks I'm working on.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="py-12">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className="text-gray-700">
              Hello! I'm Woowonjae, a passionate music producer and blogger. Welcome to my personal space where I share my journey and insights into music production.
            </p>
          </section>
        </main>
      </div>

      <audio
        ref={audioRef}
        style={{ display: 'none' }}
      />

      {audioState.currentAlbum && (
        <AudioPlayer
          album={audioState.currentAlbum}
          isPlaying={audioState.isPlaying}
          onPlayPause={() => handlePlayAlbum(audioState.currentAlbum!)}
          audioRef={audioRef}
        />
      )}
    </div>
  );
}