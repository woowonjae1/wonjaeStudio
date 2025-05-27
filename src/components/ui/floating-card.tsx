"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  floatIntensity?: number;
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export function FloatingCard({
  className,
  floatIntensity = 10,
  hoverEffect = true,
  children,
  ...props
}: FloatingCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 自动浮动动画
  useEffect(() => {
    if (!cardRef.current) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      const newX = Math.sin(time) * (floatIntensity * 0.2);
      const newY = Math.cos(time * 0.8) * (floatIntensity * 0.1);

      // 如果鼠标没有悬停，则应用浮动效果
      if (!isHovered) {
        setRotation({ x: newY * 0.5, y: newX * 0.5 });
        setPosition({ x: newX, y: newY });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [floatIntensity, isHovered]);

  // 鼠标悬停效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hoverEffect) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setRotation({ x: -y * 10, y: x * 10 });
    setPosition({ x: x * 5, y: y * 5 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // 平滑恢复到浮动状态
    const timer = setTimeout(() => {
      setRotation({ x: 0, y: 0 });
      setPosition({ x: 0, y: 0 });
    }, 100);

    return () => clearTimeout(timer);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative transition-transform duration-300 ease-out will-change-transform",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(${position.x}px) translateY(${position.y}px)`,
        transition: isHovered ? "none" : "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
} 