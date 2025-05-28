'use client';

import React, { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import dynamic from 'next/dynamic';

// 动态导入ThreeDBackground和HomeComponent以避免SSR问题
const HomeComponent = dynamic(() => import('@/components/HomeComponent'), { ssr: false });

export default function HomePage() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // 设置主题
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div>
      {/* 使用HomeComponent */}
      <HomeComponent />
    </div>
  );
} 