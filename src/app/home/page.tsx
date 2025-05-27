'use client';

import React, { useEffect } from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import Home from '../home';

export default function HomePage() {
  const { theme } = useTheme();

  useEffect(() => {
    // 设置主题
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // 确保主题设置被应用
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          console.log('Theme changed:', root.getAttribute('data-theme'));
        }
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, [theme]);

  return <Home />;
} 