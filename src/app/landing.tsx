'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MorphingText } from "@/components/magicui/morphing-text";

// 动态导入Three.js组件，避免SSR错误
const ThreeDBackground = dynamic(
  () => import('@/components/ThreeDBackground'),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();
  const titleTexts = ["NINGNING", "WOOWONJAE"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* 3D背景 */}
      <ThreeDBackground />

      {/* Hero Section - 确保内容在3D背景上方 */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 text-center z-10 relative">
        {/* 使用MorphingText组件替换静态标题 */}
        <div className="max-w-3xl w-full">
          <MorphingText 
            texts={titleTexts} 
            className="mb-8 h-24 md:h-28 lg:h-32 text-shadow" 
          />
        </div>
        
        <p className="text-lg mb-10 max-w-2xl mx-auto text-gray-300">
          独立开发者 · 音乐制作人 · 足球爱好者 · FPS游戏迷 · 生活探索者 · 设计爱好者
        </p>
        <button 
          onClick={() => router.push('/home')}
          className="border-2 border-white text-white px-10 py-3 rounded-full hover:bg-white hover:text-black transition duration-300 text-lg"
        >
          Let's Go
        </button>
      </div>

      {/* Artists Section - 确保内容在3D背景上方 */}
      <div className="py-12 max-w-5xl mx-auto grid grid-cols-3 gap-y-8 z-10 relative">
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity font-serif">
          <span className="text-2xl">Daniel Caesar</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity font-mono">
          <span className="text-xl">SZA</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity font-sans">
          <span className="text-xl font-bold">XIAH</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Impact, sans-serif'}}>
          <span className="text-xl">D4VD</span>
        </div>
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Arial, sans-serif'}}>
          <span className="text-2xl font-extrabold">WOOWONJAE</span>
        </div>
        <div className="col-span-2 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Courier New, monospace'}}>
          <span className="text-xl">KANYE WEST</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Georgia, serif'}}>
          <span className="text-xl">Drake</span>
        </div>
        <div className="col-span-3 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Verdana, sans-serif'}}>
          <span className="text-2xl">The Weeknd</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Trebuchet MS, sans-serif'}}>
          <span className="text-xl">Billie Eilish</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Times New Roman, serif'}}>
          <span className="text-xl">Frank Ocean</span>
        </div>
        <div className="col-span-1 text-center opacity-40 hover:opacity-100 transition-opacity" style={{fontFamily: 'Helvetica, sans-serif'}}>
          <span className="text-xl">Tyler, The Creator</span>
        </div>
      </div>

      {/* Footer - 确保内容在3D背景上方 */}
      <footer className="mt-auto p-4 text-center text-gray-500 text-sm z-10 relative">
        © 2024 WooWonJae Studio. All rights reserved.
      </footer>
    </div>
  );
} 