"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ArticleDottedSurface } from "@/components/ui/dotted-surface-variants";

// 音乐作品数据
const musicWorks = [
  {
    title: "Demo Track 1",
    description: "一首实验性的电子音乐作品",
    platform: "网易云音乐",
    url: "https://music.163.com",
    year: "2024",
  },
  {
    title: "Demo Track 2",
    description: "融合了爵士元素的流行曲风",
    platform: "Spotify",
    url: "https://spotify.com",
    year: "2024",
  },
];

// 社交媒体链接
const socialLinks = [
  { name: "网易云音乐", url: "https://music.163.com", icon: "🎵" },
  { name: "Spotify", url: "https://spotify.com", icon: "🎧" },
  { name: "YouTube", url: "https://youtube.com", icon: "📺" },
  { name: "Bilibili", url: "https://bilibili.com", icon: "📱" },
];

export default function MusicPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <ArticleDottedSurface />

      <div className="relative z-10 py-16">
        <Container>
          {/* 页面标题 */}
          <header className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              WJ
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
              WOOWONJAE
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              音乐创作者 / 学习者 / 聆听者
            </p>
            <p className="text-gray-500 dark:text-gray-500 max-w-xl mx-auto leading-relaxed">
              热爱音乐，专注于电子音乐和流行音乐的创作与学习。
              这里记录我的音乐旅程，分享学习心得和创作灵感。
            </p>
          </header>

          {/* 社交媒体链接 */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
              在这里找到我
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all"
                >
                  <span>{link.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* 音乐作品 */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-center mb-8 text-gray-900 dark:text-white">
              音乐作品
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {musicWorks.map((work, index) => (
                <a
                  key={index}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {work.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {work.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{work.platform}</span>
                        <span>·</span>
                        <span>{work.year}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-xl">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-6">
              更多作品正在创作中...
            </p>
          </section>

          {/* 联系方式 */}
          <section className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              联系我
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              如果你对音乐合作或交流感兴趣，欢迎联系我
            </p>
            <a
              href="mailto:contact@woowonjae.top"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              发送邮件
            </a>
          </section>

          {/* 返回链接 */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
