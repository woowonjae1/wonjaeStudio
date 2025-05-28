'use client';

import React from "react";
import Link from 'next/link';
import { useTheme } from "@/contexts/ThemeContext";
import Image from 'next/image';

export default function MusicPage() {
  const { theme } = useTheme();

  // 虚拟专辑数据
  const albums = [
    {
      id: 1,
      title: "午夜电台",
      artist: "WooWonJae",
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2023,
      genre: "电子",
      tracks: [
        { title: "深夜思绪", duration: "3:45" },
        { title: "城市回声", duration: "4:21" },
        { title: "星光下的对话", duration: "5:12" },
        { title: "雨后", duration: "3:56" }
      ]
    },
    {
      id: 2,
      title: "记忆碎片",
      artist: "WooWonJae",
      coverUrl: "https://images.unsplash.com/photo-1581375383680-7101dc5cb5f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2022,
      genre: "流行",
      tracks: [
        { title: "旧照片", duration: "4:10" },
        { title: "夏日午后", duration: "3:40" },
        { title: "遗忘的角落", duration: "4:25" },
        { title: "重逢", duration: "3:55" }
      ]
    },
    {
      id: 3,
      title: "城市之声",
      artist: "WooWonJae",
      coverUrl: "https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2021,
      genre: "嘻哈",
      tracks: [
        { title: "都市节奏", duration: "3:25" },
        { title: "霓虹灯下", duration: "4:05" },
        { title: "黎明时分", duration: "3:50" },
        { title: "地铁", duration: "4:15" }
      ]
    },
    {
      id: 4,
      title: "冬日故事",
      artist: "WooWonJae",
      coverUrl: "https://images.unsplash.com/photo-1461784180009-21121be2d29e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      year: 2020,
      genre: "民谣",
      tracks: [
        { title: "雪夜", duration: "4:30" },
        { title: "炉火", duration: "3:55" },
        { title: "远山", duration: "5:10" },
        { title: "归途", duration: "4:45" }
      ]
    }
  ];

  // AI音乐工具
  const aiTools = [
    {
      name: "Suno AI",
      description: "只需输入文本提示，就能生成高质量的歌曲，支持多种音乐风格",
      url: "https://suno.ai"
    },
    {
      name: "Stable Audio",
      description: "专注于生成逼真的音效和音乐片段，特别适合创作背景音乐",
      url: "https://stability.ai/stable-audio"
    },
    {
      name: "Mubert",
      description: "AI驱动的音乐生成平台，可以创建无限长度的背景音乐",
      url: "https://mubert.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900 pt-16 pb-12">
      {/* 导航栏 */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <Link 
          href="/"
          className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
        >
          返回首页
        </Link>
        <Link 
          href="/home"
          className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          主页
        </Link>
      </div>
      
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-4">音乐作品集</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索我创作的音乐世界，包括个人专辑、单曲以及AI辅助音乐创作工具。
          </p>
        </header>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">专辑作品</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image 
                    src={album.coverUrl} 
                    alt={album.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">{album.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{album.artist} · {album.year} · {album.genre}</p>
                  
                  <div className="mt-3 space-y-1">
                    {album.tracks.map((track, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{track.title}</span>
                        <span className="text-gray-500 dark:text-gray-400">{track.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">AI音乐创作工具</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiTools.map((tool, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-2">{tool.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                >
                  访问网站 →
                </a>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">音乐创作理念</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              音乐对我而言是情感的直接表达。我的创作灵感来源于城市生活、自然风景以及人际关系中的微妙情感。
              我尝试将传统音乐元素与现代电子音乐技术相结合，创造出独特的音乐体验。
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              在AI时代，我也积极探索人工智能在音乐创作中的应用，将人类情感与机器学习相结合，
              探索音乐创作的新可能性。每一首歌都是一次情感的旅程，希望能与听众产生共鸣。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 