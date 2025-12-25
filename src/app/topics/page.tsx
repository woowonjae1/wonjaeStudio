"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ArticleDottedSurface } from "@/components/ui/dotted-surface-variants";

// 主题数据（客户端使用静态数据）
const topicsData = [
  {
    name: "乐理学习",
    slug: "music-theory",
    description: "音乐理论基础知识，包括和声、节奏、曲式分析等",
    icon: "🎼",
  },
  {
    name: "聆听笔记",
    slug: "listening-notes",
    description: "专辑和歌曲的聆听感想与分析",
    icon: "🎧",
  },
  {
    name: "创作心得",
    slug: "composition",
    description: "音乐创作过程中的思考与经验分享",
    icon: "✍️",
  },
  {
    name: "练习日志",
    slug: "practice",
    description: "乐器练习记录与技巧总结",
    icon: "🎹",
  },
];

export default function TopicsPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <ArticleDottedSurface />

      <div className="relative z-10 py-16">
        <Container>
          {/* 页面标题 */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
              主题分类
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              按主题浏览所有笔记，找到你感兴趣的内容
            </p>
          </header>

          {/* 主题卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {topicsData.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{topic.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {topic.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 返回链接 */}
          <div className="text-center mt-12">
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← 返回所有笔记
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
