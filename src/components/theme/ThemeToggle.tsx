"use client";

import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 初始化主题
  useEffect(() => {
    setMounted(true);

    // 优先级：本地存储 > 系统偏好 > 默认浅色
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = systemPrefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
      document.documentElement.classList.toggle(
        "dark",
        initialTheme === "dark"
      );
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置时才跟随系统
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // 避免服务端渲染不匹配
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="切换主题">
        浅色模式
      </button>
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`切换到${theme === "light" ? "深色" : "浅色"}模式`}
    >
      {theme === "light" ? "深色模式" : "浅色模式"}
    </button>
  );
}
