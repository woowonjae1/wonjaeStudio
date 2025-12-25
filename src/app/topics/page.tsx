"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

// 主题数据
const topicsData = [
  {
    name: "聆听笔记",
    slug: "listening-notes",
    description: "专辑和歌曲的聆听感想与分析",
  },
  {
    name: "乐理学习",
    slug: "music-theory",
    description: "音乐理论基础知识，包括和声、节奏、曲式分析等",
  },
  {
    name: "创作心得",
    slug: "composition",
    description: "音乐创作过程中的思考与经验分享",
  },
  {
    name: "练习日志",
    slug: "practice",
    description: "乐器练习记录与技巧总结",
  },
];

export default function TopicsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="py-16">
        <Container>
          {/* 页面标题 */}
          <header className="text-center mb-12">
            <h1
              className="text-2xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              主题分类
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              按主题浏览所有笔记
            </p>
          </header>

          {/* 主题列表 */}
          <div className="max-w-2xl mx-auto space-y-3">
            {topicsData.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="block p-5 rounded-lg transition-all duration-200"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-base font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {topic.name}
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {topic.description}
                    </p>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* 返回链接 */}
          <div className="text-center mt-12">
            <Link
              href="/notes"
              className="inline-block px-4 py-2 text-sm rounded-md transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              返回所有笔记
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
