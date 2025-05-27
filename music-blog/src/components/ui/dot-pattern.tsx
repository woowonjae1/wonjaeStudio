"use client";

import React, { useRef, useEffect } from "react";

interface DotPatternProps {
  className?: string;
  size?: number;
}

export function DotPattern({ className, size = 20 }: DotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    let animationFrameId: number;
    let dots: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    // 初始化点
    const initDots = () => {
      dots = [];
      const numDots = Math.floor((canvas.width * canvas.height) / (size * size * 100));
      for (let i = 0; i < numDots; i++) {
        dots.push({
          x: Math.random() * canvas.width / dpr,
          y: Math.random() * canvas.height / dpr,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    initDots();

    // 绘制函数
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // 边界检查
        if (dot.x < 0 || dot.x > canvas.width / dpr) {
          dot.vx = -dot.vx;
        }
        if (dot.y < 0 || dot.y > canvas.height / dpr) {
          dot.vy = -dot.vy;
        }

        let alpha = 1;
        // 中心点渐变效果
        const centerX = canvas.width / dpr / 2;
        const centerY = canvas.height / dpr / 2;
        const distX = Math.abs(dot.x - centerX) / (canvas.width / dpr / 2);
        const distY = Math.abs(dot.y - centerY) / (canvas.height / dpr / 2);
        const dist = Math.max(distX, distY);
        alpha = 1 - Math.min(dist, 1);

        ctx.fillStyle = `rgba(143, 143, 143, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // 启动动画
    draw();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
} 