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
import FixturesAPI from '@/components/FixturesAPI';
import MusicProduction from '@/components/MusicProduction';

// 使用 Next.js 的数据获取方法
export const revalidate = 3600; // 每小时重新验证一次

export default function Home() {
  const [audioState, setAudioState] = useState({
    currentAlbum: null as Album | null,
    isPlaying: false,
  });
  const [activeTab, setActiveTab] = useState('suno');
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

  const tools = {
    suno: {
      name: 'Suno AI',
      description: 'Suno 是一个强大的 AI 音乐生成工具，可以创建各种风格的音乐。',
      features: [
        '支持多种音乐风格生成',
        '可以控制音乐长度和情绪',
        '提供高质量的音乐输出',
        '支持文本描述生成音乐'
      ],
      usage: [
        '访问 Suno 官网 (https://suno.ai)',
        '注册并获取 API key',
        '使用文本描述你想要创建的音乐',
        '选择音乐风格和长度',
        '等待生成结果'
      ],
      tips: [
        '使用详细的描述可以获得更好的结果',
        '可以指定具体的乐器组合',
        '可以描述音乐的情绪和氛围',
        '建议使用英文提示词获得更好的效果'
      ]
    },
    stableAudio: {
      name: 'Stable Audio',
      description: 'Stable Audio 是一个专注于音频生成的 AI 工具，特别适合创建音效和短音乐片段。',
      features: [
        '专注于音效生成',
        '支持多种音频格式',
        '快速生成短音频片段',
        '适合游戏和视频制作'
      ],
      usage: [
        '访问 Stable Audio 官网',
        '创建账户并获取访问权限',
        '选择音频类型（音乐/音效）',
        '输入描述或上传参考音频',
        '调整参数并生成'
      ],
      tips: [
        '音效生成建议使用具体的描述',
        '可以上传参考音频来获得类似效果',
        '注意调整生成时长',
        '可以组合多个音效创建复杂效果'
      ]
    },
    aceStep: {
      name: 'Ace Step',
      description: 'Ace Step 是一个专业的音乐制作 AI 工具，特别适合电子音乐创作。',
      features: [
        '专注于电子音乐生成',
        '支持多种电子音乐风格',
        '提供专业的音乐制作工具',
        '可以导出多种格式'
      ],
      usage: [
        '下载并安装 Ace Step 软件',
        '选择音乐风格和模板',
        '调整音乐参数',
        '添加效果和混音',
        '导出最终作品'
      ],
      tips: [
        '建议先熟悉各种电子音乐风格',
        '可以组合多个模板创建独特作品',
        '注意调整 BPM 和调性',
        '使用内置效果器增强音乐表现'
      ]
    },
    mubert: {
      name: 'Mubert',
      description: 'Mubert 是一个基于 AI 的音乐生成平台，特别适合创建背景音乐和氛围音乐。',
      features: [
        '支持实时音乐生成',
        '提供丰富的音乐风格库',
        '可以生成无限长度的音乐',
        '支持商业用途'
      ],
      usage: [
        '访问 Mubert 官网 (https://mubert.com)',
        '注册开发者账户',
        '获取 API 密钥',
        '选择音乐风格和参数',
        '生成并下载音乐'
      ],
      tips: [
        '可以组合多个标签来获得更精确的结果',
        '使用情绪标签来调整音乐氛围',
        '可以设置音乐长度和循环方式',
        '支持实时调整音乐参数'
      ]
    },
    amper: {
      name: 'Amper Music',
      description: 'Amper Music 是一个专业的 AI 作曲工具，特别适合创建商业音乐和配乐。',
      features: [
        '支持多种音乐风格和流派',
        '提供专业的音乐制作工具',
        '支持自定义音乐结构',
        '适合商业用途'
      ],
      usage: [
        '注册 Amper Music 账户',
        '选择音乐风格和情绪',
        '设置音乐长度和结构',
        '调整音乐参数',
        '导出最终作品'
      ],
      tips: [
        '使用情绪标签来调整音乐风格',
        '可以设置音乐的高潮和过渡',
        '支持导出多种音频格式',
        '可以调整乐器和音色'
      ]
    },
    aiva: {
      name: 'AIVA',
      description: 'AIVA 是一个专业的 AI 作曲助手，特别适合创建古典音乐和电影配乐。',
      features: [
        '专注于古典音乐创作',
        '支持多种音乐风格',
        '提供专业的编曲工具',
        '可以生成完整的音乐作品'
      ],
      usage: [
        '注册 AIVA 账户',
        '选择音乐风格和类型',
        '设置音乐参数和结构',
        '生成并编辑音乐',
        '导出最终作品'
      ],
      tips: [
        '可以上传参考音乐来获得类似风格',
        '支持调整音乐的情绪和强度',
        '可以编辑和修改生成的音乐',
        '支持导出多种格式和分轨'
      ]
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#1C2C5B] mr-2">•</span>
                  <div>
                    <h4 className="font-medium">AI Music Generation Platform</h4>
                    <p className="text-gray-600">A Next.js application for AI-powered music creation and collaboration.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1C2C5B] mr-2">•</span>
                  <div>
                    <h4 className="font-medium">Personal Portfolio</h4>
                    <p className="text-gray-600">A modern portfolio website built with Next.js and Tailwind CSS.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1C2C5B] mr-2">•</span>
                  <div>
                    <h4 className="font-medium">Music Production Tools</h4>
                    <p className="text-gray-600">Collection of web-based tools for music production and audio processing.</p>
                  </div>
                </li>
              </ul>
            </div>
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

            <h3 className="text-2xl font-bold mb-6">Latest News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">Kevin De Bruyne's Departure</h4>
                <p className="text-gray-600 mb-4">
                  Manchester City's midfield maestro Kevin De Bruyne has announced his departure from the club. The Belgian international, who has been instrumental in City's recent success, will be leaving after 8 successful seasons at the Etihad Stadium.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Impact:</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>8 seasons at Manchester City</li>
                    <li>96 goals and 153 assists</li>
                    <li>5 Premier League titles</li>
                    <li>1 Champions League title</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">Transfer Updates</h4>
                <p className="text-gray-600 mb-4">
                  Manchester City is actively working on strengthening their squad for the upcoming season. The club is looking to bring in new talent to maintain their dominance in both domestic and European competitions.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Recent Activities:</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>Scouting for midfield replacements</li>
                    <li>Monitoring young talents</li>
                    <li>Contract renewals for key players</li>
                    <li>Youth academy promotions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 阵型图展示 */}
            <div className="mb-8 flex flex-col items-center">
              <Image
                src="/image/mcfc_pitch_open.jpg"
                alt="Manchester City Pitch 24-25"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-contain w-full max-w-[600px] h-auto"
                priority
              />
            </div>

            <h3 className="text-2xl font-bold mb-6">First Team Players</h3>
            <FixturesAPI />
          </section>

          <section id="game" className="py-12">
            <h2 className="text-3xl font-bold mb-4">Game</h2>
            
            <p className="text-gray-700 mb-4">
              Check out my game development projects and gaming content. From design to implementation, I enjoy creating engaging experiences.
            </p>
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

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Music Production</h2>
              
              {/* Banner 模块 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="relative w-full" style={{ paddingTop: '50%' }}>
                  <Image
                    src="/image/Wyy.jpg"
                    alt="Music Production Banner"
                    fill
                    className="object-contain object-center scale-125"
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

              {/* AI 音乐工具指南 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6">AI 音乐生成工具指南</h3>
                
                {/* 工具选择标签 */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {Object.keys(tools).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setActiveTab(tool)}
                      className={`px-4 py-2 rounded-md ${
                        activeTab === tool
                          ? 'bg-[#1C2C5B] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tools[tool as keyof typeof tools].name}
                    </button>
                  ))}
                </div>

                {/* 工具详情 */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {tools[activeTab as keyof typeof tools].name}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {tools[activeTab as keyof typeof tools].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 功能特点 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">主要功能</h3>
                      <ul className="space-y-2">
                        {tools[activeTab as keyof typeof tools].features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#1C2C5B] mr-2">•</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 使用步骤 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">使用步骤</h3>
                      <ol className="space-y-2">
                        {tools[activeTab as keyof typeof tools].usage.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#1C2C5B] mr-2">{index + 1}.</span>
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* 使用技巧 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">使用技巧</h3>
                    <ul className="space-y-2">
                      {tools[activeTab as keyof typeof tools].tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#1C2C5B] mr-2">💡</span>
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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

          <MusicProduction />
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