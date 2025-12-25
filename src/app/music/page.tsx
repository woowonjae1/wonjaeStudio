"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

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
  { name: "网易云音乐", url: "https://music.163.com" },
  { name: "Spotify", url: "https://spotify.com" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Bilibili", url: "https://bilibili.com" },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="py-16">
        <Container>
          {/* 页面标题 */}
          <header className="text-center mb-16">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-xl font-bold"
              style={{
                background: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              WJ
            </div>
            <h1
              className="text-2xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              WOOWONJAE
            </h1>
            <p
              className="text-base mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              音乐创作者 / 学习者 / 聆听者
            </p>
            <p
              className="text-sm max-w-md mx-auto leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              热爱音乐，专注于电子音乐和流行音乐的创作与学习。
              这里记录我的音乐旅程，分享学习心得和创作灵感。
            </p>
          </header>

          {/* 社交媒体链接 */}
          <section className="mb-16">
            <h2
              className="text-base font-semibold text-center mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              在这里找到我
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm rounded-md transition-all"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </section>

          {/* 音乐作品 */}
          <section className="mb-16">
            <h2
              className="text-base font-semibold text-center mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              音乐作品
            </h2>
            <div className="max-w-lg mx-auto space-y-3">
              {musicWorks.map((work, index) => (
                <a
                  key={index}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    textDecoration: "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {work.title}
                      </h3>
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {work.description}
                      </p>
                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span>{work.platform}</span>
                        <span>·</span>
                        <span>{work.year}</span>
                      </div>
                    </div>
                    <span style={{ color: "var(--text-muted)" }}>→</span>
                  </div>
                </a>
              ))}
            </div>
            <p
              className="text-center text-sm mt-6"
              style={{ color: "var(--text-muted)" }}
            >
              更多作品正在创作中...
            </p>
          </section>

          {/* 联系方式 */}
          <section className="text-center">
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              联系我
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              如果你对音乐合作或交流感兴趣，欢迎联系我
            </p>
            <a
              href="mailto:contact@woowonjae.top"
              className="inline-block px-6 py-3 text-sm font-medium rounded-md transition-colors"
              style={{
                background: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              发送邮件
            </a>
          </section>

          {/* 返回链接 */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm rounded-md transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              返回首页
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
