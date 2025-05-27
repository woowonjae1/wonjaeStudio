'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MorphingText } from "@/components/magicui/morphing-text";
import { LoadingTransition } from "@/components/LoadingTransition";
import { useTheme } from "@/contexts/ThemeContext";
import { WavyBackground } from "@/ui/wavy-background";

// 动态导入Three.js组件，避免SSR错误
const ThreeDBackground = dynamic(
  () => import('@/components/ThreeDBackground'),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const { theme, isNightMode } = useTheme();
  const titleTexts = ["NINGNING", "WOOWONJAE"];

  const handleClick = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    router.push('/home');
  };

  useEffect(() => {
    // 设置主题
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col relative transition-colors duration-300`}>
      {/* Wavy background instead of 3D background */}
      <WavyBackground 
        className="absolute inset-0" 
        containerClassName="absolute inset-0"
        backgroundFill="black"
        waveOpacity={0.6}
        blur={12}
      />

      {/* Hero Section - 确保内容在背景上方 */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 text-center z-10 relative">
        {/* 使用MorphingText组件替换静态标题 */}
        <div className="max-w-3xl w-full">
          <MorphingText 
            texts={titleTexts} 
            className="mb-8 h-24 md:h-28 lg:h-32 text-shadow" 
          />
        </div>
        
        <p className="text-lg mb-10 max-w-2xl mx-auto text-[var(--text)] opacity-70">
          独立开发者 · 音乐制作人 · 足球爱好者 · FPS游戏迷 · 生活探索者 · 设计爱好者
        </p>
        <button 
          onClick={handleClick}
          className="border-2 border-[var(--text)] text-[var(--text)] px-10 py-3 rounded-full hover:bg-[var(--text)] hover:text-[var(--background)] transition duration-300 text-lg"
        >
          Let's Go
        </button>
      </div>

      {/* Loading Transition */}
      {showLoading && (
        <LoadingTransition onComplete={handleLoadingComplete} />
      )}

      {/* Artists Section */}
      <div className="py-12 max-w-5xl mx-auto grid grid-cols-3 gap-y-8 z-10 relative">
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity font-serif text-[var(--text)]">
          <span className="text-2xl">Daniel Caesar</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity font-mono text-[var(--text)]">
          <span className="text-xl">SZA</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity font-sans text-[var(--text)]">
          <span className="text-xl font-bold">XIAH</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Impact, sans-serif'}}>
          <span className="text-xl">D4VD</span>
        </div>
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Arial, sans-serif'}}>
          <span className="text-2xl font-extrabold">WOOWONJAE</span>
        </div>
        <div className="col-span-2 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Courier New, monospace'}}>
          <span className="text-xl">KANYE WEST</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Georgia, serif'}}>
          <span className="text-xl">Drake</span>
        </div>
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Verdana, sans-serif'}}>
          <span className="text-2xl">The Weeknd</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Trebuchet MS, sans-serif'}}>
          <span className="text-xl">Billie Eilish</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Times New Roman, serif'}}>
          <span className="text-xl">Frank Ocean</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity text-[var(--text)]" style={{fontFamily: 'Helvetica, sans-serif'}}>
          <span className="text-xl">Tyler, The Creator</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto p-4 text-center text-[var(--text)] opacity-50 text-sm z-10 relative">
        © 2024 WooWonJae Studio. All rights reserved.
      </footer>
    </div>
  );
} 