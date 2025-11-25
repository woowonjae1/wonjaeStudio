"use client";

import React from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  loading: () => <div className="skeleton h-96 w-full" />,
});
const FeaturedCard = dynamic(() => import("@/components/cards/FeaturedCard"), {
  loading: () => <div className="skeleton h-48 w-full" />,
});
const CarouselSection = dynamic(
  () => import("@/components/sections/CarouselSection"),
  { loading: () => <div className="skeleton h-64 w-full" /> }
);
const AlbumCardEnhanced = dynamic(
  () => import("@/components/cards/AlbumCardEnhanced"),
  { loading: () => <div className="skeleton h-48 w-full" /> }
);

export default function HomePage() {
  const albums = [
    {
      id: "1",
      title: "浪漫傍晚",
      artist: "WooWonJae",
      coverUrl: "/image/Romantic.jpg",
      year: 2024,
    },
    {
      id: "2",
      title: "Blue Groove",
      artist: "WooWonJae",
      coverUrl: "/image/iambluegroove.jpg",
      year: 2024,
    },
    {
      id: "3",
      title: "R&B Collection",
      artist: "WooWonJae",
      coverUrl: "/image/nobodygetsme.jpg",
      year: 2024,
    },
    {
      id: "4",
      title: "新篇章",
      artist: "WooWonJae",
      coverUrl: "/image/newalbum/woowonjae.jpg",
      year: 2024,
    },
    {
      id: "5",
      title: "Daniel Caesar",
      artist: "Daniel Caesar",
      coverUrl: "/image/newalbum/daniel caesar.jpg",
      year: 2023,
    },
  ];

  return (
    <MainLayout>
      <main className="min-h-screen bg-[var(--bg-base)] pt-0 pb-12">
        {/* Hero Section */}
        <HeroSection
          title="WOOWONJAE"
          subtitle="音乐制作人 · 独立开发者"
          description="探索音乐与技术的交汇点，创造独特的声音体验"
          backgroundImage="/image/collage.jpg"
          ctaText="探索音乐"
          ctaHref="/music"
          height="large"
        />

        <div className="container-wide py-16 space-y-20">
          {/* Featured Section - 精选作品 */}
          <section>
            <h2 className="text-3xl font-bold mb-8">精选作品</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeaturedCard
                title="浪漫傍晚"
                subtitle="最新专辑"
                description="在深夜的电波中，寻找内心的声音"
                imageUrl="/image/Romantic.jpg"
                href="/music"
                size="large"
                gradient="linear-gradient(to top, rgba(29,185,84,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
              />
              <FeaturedCard
                title="R&B Collection"
                subtitle="经典回顾"
                description="时间的碎片，拼凑成永恒的旋律"
                imageUrl="/image/nobodygetsme.jpg"
                href="/music"
                size="large"
                gradient="linear-gradient(to top, rgba(102,126,234,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
              />
            </div>
          </section>

          {/* Carousel - 最新发布 */}
          <CarouselSection title="最新发布" viewAllHref="/music">
            {albums.map((album) => (
              <AlbumCardEnhanced key={album.id} {...album} size="medium" />
            ))}
          </CarouselSection>

          {/* Music Story Card - 音乐故事 */}
          <section>
            <div className="card-featured overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto relative">
                  <img
                    src="/image/banner.jpg"
                    alt="音乐制作"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center bg-[var(--bg-elevated)]">
                  <p className="text-sm font-semibold text-[var(--spotify-green)] uppercase tracking-wider mb-4">
                    创作故事
                  </p>
                  <h3 className="text-4xl font-bold mb-6">音乐与技术的融合</h3>
                  <div className="space-y-4 text-[var(--text-subdued)] leading-relaxed">
                    <p>
                      作为一名音乐制作人和开发者，我始终在探索如何将这两个看似不同的领域结合起来。
                    </p>
                    <p>
                      音乐是情感的表达，技术是创造的工具。当两者相遇，便能创造出无限可能。
                    </p>
                  </div>
                  <Link
                    href="/about"
                    className="mt-8 inline-flex items-center gap-2 text-[var(--spotify-green)] font-semibold hover:gap-4 transition-all"
                  >
                    <span>了解更多</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8-8-8z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Section - 专辑作品集 */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">专辑作品集</h2>
              <Link
                href="/music"
                className="text-sm font-semibold text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors"
              >
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.map((album) => (
                <AlbumCardEnhanced key={album.id} {...album} size="medium" />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-20">
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--bg-elevated-highlight)] rounded-2xl p-12 border border-[var(--decorative-subdued)]">
              <h2 className="text-4xl font-bold mb-4">准备好探索了吗?</h2>
              <p className="text-lg text-[var(--text-subdued)] mb-8">
                沉浸在独特的音乐世界中
              </p>
              <Link href="/music">
                <button className="btn-spotify text-lg px-10 py-4">
                  开始听听
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
