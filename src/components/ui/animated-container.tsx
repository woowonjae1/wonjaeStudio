"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "./dot-pattern";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  backgroundPattern?: boolean;
}

export function AnimatedContainer({
  children,
  className,
  backgroundPattern = true,
}: AnimatedContainerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 鼠标移动效果
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // 滚动效果
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 动态计算鼠标位置引起的视差效果
  const calculateParallaxStyles = () => {
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

    const moveX = (mousePosition.x - winWidth / 2) / winWidth * 10;
    const moveY = (mousePosition.y - winHeight / 2) / winHeight * 10;

    return {
      transform: `translateX(${moveX}px) translateY(${moveY - scrollY * 0.02}px)`,
    };
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {backgroundPattern && (
        <DotPattern
          className="fixed inset-0 z-[-1] opacity-70 [mask-image:radial-gradient(350px_circle_at_center,white,transparent)]"
          size={20}
          fadeScaleX={1.2}
          fadeScaleY={1.2}
        />
      )}
      
      <div
        className="relative z-10 transition-transform duration-500 ease-out"
        style={calculateParallaxStyles()}
      >
        {children}
      </div>
    </div>
  );
} 