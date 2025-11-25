"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  children?: ReactNode;
  height?: "full" | "large" | "medium";
}

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaText = "探索更多",
  ctaHref,
  onCtaClick,
  children,
  height = "large",
}: HeroSectionProps) {
  const heightClasses = {
    full: "min-h-screen",
    large: "min-h-[80vh]",
    medium: "min-h-[60vh]",
  };

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <section
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden`}
    >
      {/* 背景图片（如果提供） */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>
          {/* 渐变蒙版 */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </>
      )}

      {/* 内容 */}
      <div className="relative z-20 container-wide text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* 副标题 */}
          {subtitle && (
            <p className="text-sm md:text-base font-semibold text-[var(--spotify-green)] uppercase tracking-wider mb-4 animate-fade-in">
              {subtitle}
            </p>
          )}

          {/* 主标题 */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            {title}
          </h1>

          {/* 描述 */}
          {description && (
            <p
              className="text-lg md:text-xl text-[var(--text-subdued)] mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              {description}
            </p>
          )}

          {/* CTA 按钮 */}
          {ctaText && (ctaHref || onCtaClick) && (
            <div
              className="animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              {ctaHref ? (
                <Link href={ctaHref}>
                  <button className="btn-spotify text-base md:text-lg px-8 py-4">
                    {ctaText}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleCtaClick}
                  className="btn-spotify text-base md:text-lg px-8 py-4"
                >
                  {ctaText}
                </button>
              )}
            </div>
          )}

          {/* 自定义内容 */}
          {children && (
            <div
              className="mt-12 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {/* 底部渐变（增加可读性） */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent z-15" />
    </section>
  );
}
