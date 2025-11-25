"use client";

import React, { useRef, ReactNode } from "react";

interface CarouselSectionProps {
  title: string;
  children: ReactNode;
  viewAllHref?: string;
}

export default function CarouselSection({
  title,
  children,
  viewAllHref,
}: CarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 卡片宽度 + 间距
      const newPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8">
      {/* 标题和导航 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>

        <div className="flex items-center gap-4">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors"
            >
              查看全部
            </a>
          )}

          {/* 滚动按钮 */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-[var(--bg-elevated-highlight)] hover:bg-[var(--bg-elevated-press)] transition-colors"
              aria-label="向左滚动"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-[var(--bg-elevated-highlight)] hover:bg-[var(--bg-elevated-press)] transition-colors"
              aria-label="向右滚动"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 滚动容器 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
