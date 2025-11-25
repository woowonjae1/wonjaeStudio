"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  href?: string;
  onClick?: () => void;
  size?: "large" | "medium";
  gradient?: string;
}

export default function FeaturedCard({
  title,
  subtitle,
  description,
  imageUrl,
  href,
  onClick,
  size = "large",
  gradient,
}: FeaturedCardProps) {
  const heightClass = size === "large" ? "h-[500px]" : "h-[400px]";

  const content = (
    <div
      className={`card-featured group relative ${heightClass} cursor-pointer`}
    >
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* 渐变叠加层 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            gradient ||
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />

      {/* 内容 */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
        {subtitle && (
          <p className="text-sm font-semibold text-[var(--spotify-green)] uppercase tracking-wider mb-2">
            {subtitle}
          </p>
        )}

        <h3 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-[var(--spotify-green)] transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-[var(--text-subdued)] text-base md:text-lg max-w-md leading-relaxed">
            {description}
          </p>
        )}

        {/* Hover 提示 */}
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>探索</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8-8-8z" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}
