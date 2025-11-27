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
  const heightClass = size === "large" ? "h-[480px]" : "h-[360px]";

  const content = (
    <div
      className={`card-featured group relative ${heightClass} cursor-pointer w-full`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={size === "large"}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background:
            gradient ||
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
        {subtitle && (
          <p className="text-xs font-bold text-[var(--spotify-green)] uppercase tracking-widest mb-3 opacity-90">
            {subtitle}
          </p>
        )}

        <h3 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-balance">
          {title}
        </h3>

        {description && (
          <p className="text-[var(--text-subdued)] text-sm md:text-base max-w-lg leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {/* Action Indicator */}
        <div className="flex items-center gap-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <div className="w-10 h-10 rounded-full bg-[var(--spotify-green)] flex items-center justify-center text-black shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-wide">Play Now</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="block w-full">
        {content}
      </div>
    );
  }

  return content;
}
