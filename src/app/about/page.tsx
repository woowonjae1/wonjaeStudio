"use client";

import React from "react";
import Navigation from "@/components/layout/Navigation";
import MusicPlayerBar from "@/components/player/MusicPlayerBar";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <MusicPlayerBar />

      <div className="min-h-screen bg-[var(--bg-base)] pt-16 pb-24">
        <div className="container max-w-5xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <section className="mb-20 animate-fade-in">
            <h1 className="text-6xl font-bold mb-6">关于我</h1>
            <p className="text-2xl text-[var(--text-subdued)]">
              音乐制作人 · 独立开发者
            </p>
          </section>

          {/* Bio Sections */}
          <div className="space-y-16">
            <section
              className="animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <div className="bg-[var(--bg-elevated-base)] rounded-2xl p-8 hover:bg-[var(--bg-elevated-highlight)] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--spotify-green)] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">音乐创作</h2>
                    <div className="text-[var(--text-subdued)] space-y-3 leading-relaxed">
                      <p>
                        我是一名音乐制作人，专注于电子音乐和流行音乐的创作。
                        我的创作灵感来源于城市生活、自然风景，以及人与人之间微妙的情感联系。
                      </p>
                      <p>
                        在创作过程中，我尝试将传统音乐元素与现代电子音乐技术相结合，
                        通过旋律、节奏和音色的巧妙编排，创造出独特而富有情感的音乐体验。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="bg-[var(--bg-elevated-base)] rounded-2xl p-8 hover:bg-[var(--bg-elevated-highlight)] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--spotify-green)] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">技术探索</h2>
                    <div className="text-[var(--text-subdued)] space-y-3 leading-relaxed">
                      <p>
                        作为一名独立开发者，我热衷于探索音乐与技术的交汇点。
                        这个网站就是我将音乐创作与Web开发技术结合的产物。
                      </p>
                      <p>
                        我使用现代Web技术（Next.js, TypeScript,
                        Zustand）构建了这个平台，
                        参考Spotify的设计系统，以最优的方式呈现我的音乐作品，同时为访客提供流畅的浏览和播放体验。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="bg-[var(--bg-elevated-base)] rounded-2xl p-8 hover:bg-[var(--bg-elevated-highlight)] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--spotify-green)] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">未来方向</h2>
                    <div className="text-[var(--text-subdued)] space-y-3 leading-relaxed">
                      <p>
                        我相信音乐与技术的结合能够创造无限可能。在未来，我计划继续深入探索：
                      </p>
                      <ul className="space-y-2 pl-6">
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--spotify-green)] mt-1.5">
                            ●
                          </span>
                          <span>AI 辅助音乐创作的新可能性</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--spotify-green)] mt-1.5">
                            ●
                          </span>
                          <span>沉浸式音乐视觉体验</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--spotify-green)] mt-1.5">
                            ●
                          </span>
                          <span>音乐与互动艺术的融合</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <section
            className="mt-20 text-center animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <div className="bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--bg-elevated-highlight)] rounded-2xl p-12 border border-[var(--decorative-subdued)]">
              <h2 className="text-3xl font-bold mb-4">联系我</h2>
              <p className="text-lg text-[var(--text-subdued)] mb-8 max-w-2xl mx-auto">
                对我的音乐作品感兴趣？想要合作？欢迎通过以下方式联系我
              </p>

              <a href="mailto:contact@woowonjae.top" className="inline-block">
                <button className="btn-spotify">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  发送邮件
                </button>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
