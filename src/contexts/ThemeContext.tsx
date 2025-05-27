'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isNightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isNightMode: true,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 从 localStorage 获取保存的主题，如果没有则根据时间设置
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        return savedTheme;
      }
    }
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 9) ? 'dark' : 'light';
  });

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 9;
      const newTheme = isNight ? 'dark' : 'light';
      
      if (newTheme !== theme) {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };

    // 初始检查
    checkTime();

    // 每分钟检查一次时间
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [theme]);

  // 当主题改变时，更新 HTML 属性和 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isNightMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
} 