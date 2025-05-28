'use client';

import React, { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 动态导入ThreeDBackground和HomeComponent以避免SSR问题
const ThreeDBackground = dynamic(() => import('@/components/ThreeDBackground'), { ssr: false });
const HomeComponent = dynamic(() => import('@/components/HomeComponent'), { ssr: false });

export default function HomePage() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // 设置主题
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div>
      {/* 3D背景 */}
      <ThreeDBackground />
      
      {/* 导航返回首页 */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          返回首页
        </Link>
        <Link 
          href="/music"
          className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
        >
          音乐
        </Link>
        <Link 
          href="/code"
          className="inline-block bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition"
        >
          代码
        </Link>
        <Link 
          href="/about"
          className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          关于
        </Link>
      </div>

      {/* 使用HomeComponent */}
      <HomeComponent />
    </div>
  );
} 