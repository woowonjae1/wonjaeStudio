"use client";

import { useState } from "react";
import { AlbumListEnhanced } from "@/components/album/AlbumListEnhanced";
import { PostListAdvanced } from "@/components/blog/PostListAdvanced";
import { CommentSectionAdvanced } from "@/components/social/CommentSectionAdvanced";

/**
 * /app/demo/page.tsx
 * API 集成演示页面
 * 展示所有的前端+后端集成功能
 */
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"music" | "posts" | "comments">(
    "music"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">API 功能演示</h1>
              <p className="text-gray-600 mt-1">完整的前端+后端集成展示</p>
            </div>
            <div className="flex gap-2">
              <a
                href="/docs"
                target="_blank"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📚 API 文档
              </a>
              <a
                href="/"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                ← 返回首页
              </a>
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("music")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "music"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              🎵 音乐功能
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "posts"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              📝 文章功能
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "comments"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              💬 评论功能
            </button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 音乐标签页 */}
        {activeTab === "music" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="font-bold text-blue-900 mb-2">
                🎵 音乐库功能演示
              </h3>
              <p className="text-sm text-blue-800">
                ✅ 动态加载专辑列表 (GET /api/albums)
                <br />
                ✅ 点赞功能 (POST /api/favorites)
                <br />
                ✅ 收藏功能 (POST /api/favorites)
                <br />
                ✅ 实时统计显示
                <br />✅ 音乐播放器
              </p>
            </div>
            <AlbumListEnhanced />
          </div>
        )}

        {/* 文章标签页 */}
        {activeTab === "posts" && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <h3 className="font-bold text-green-900 mb-2">📝 文章功能演示</h3>
              <p className="text-sm text-green-800">
                ✅ 动态加载文章列表 (GET /api/posts)
                <br />
                ✅ 点赞功能 (POST /api/favorites)
                <br />
                ✅ 收藏功能 (POST /api/favorites)
                <br />
                ✅ 文章详情页面 (GET /api/posts/:slug)
                <br />✅ 评论区集成
              </p>
            </div>
            <PostListAdvanced />
          </div>
        )}

        {/* 评论标签页 */}
        {activeTab === "comments" && (
          <div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
              <h3 className="font-bold text-purple-900 mb-2">
                💬 评论功能演示
              </h3>
              <p className="text-sm text-purple-800">
                ✅ 加载评论列表 (GET /api/comments)
                <br />
                ✅ 发表评论 (POST /api/comments)
                <br />
                ✅ 嵌套回复支持
                <br />
                ✅ 用户信息显示
                <br />✅ 评论删除功能
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CommentSectionAdvanced
                itemType="album"
                itemId="demo-album-id"
                title="示例评论区"
              />
            </div>
          </div>
        )}
      </div>

      {/* 功能矩阵 */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-8">✨ 完整功能矩阵</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 用户交互 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">👤 用户交互</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ 用户登录/注册</li>
              <li>✅ 查看用户资料 (GET /api/user/:id)</li>
              <li>✅ 更新自己的资料 (PUT /api/user/profile)</li>
              <li>✅ 头像上传 (POST /api/user/avatar)</li>
              <li>✅ 关注/取消关注 (POST/DELETE /api/social/follow)</li>
              <li>✅ 查看统计数据 (GET /api/stats/user)</li>
            </ul>
          </div>

          {/* 内容交互 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">📚 内容交互</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ 浏览专辑/文章 (GET /api/albums, /api/posts)</li>
              <li>✅ 查看详情 (GET /api/albums/:id, /api/posts/:slug)</li>
              <li>✅ 点赞内容 (POST /api/favorites)</li>
              <li>✅ 收藏内容 (POST /api/favorites)</li>
              <li>✅ 发表评论 (POST /api/comments)</li>
              <li>✅ 查看统计 (GET /api/stats/content)</li>
            </ul>
          </div>

          {/* 搜索发现 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">🔍 搜索发现</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ 多类型搜索 (GET /api/search)</li>
              <li>✅ 分类浏览</li>
              <li>✅ 分页加载</li>
              <li>✅ 排序过滤</li>
              <li>✅ 搜索结果统计</li>
              <li>✅ 推荐内容</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 技术栈 */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-8">🛠️ 技术栈</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3">前端</h3>
            <ul className="space-y-2 text-sm">
              <li>📦 React 18 + Next.js 14</li>
              <li>📘 TypeScript 5.3</li>
              <li>🎨 Tailwind CSS</li>
              <li>📡 Fetch API</li>
              <li>🔑 Authentication (Bearer Token)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">后端</h3>
            <ul className="space-y-2 text-sm">
              <li>⚡ Next.js 14 API Routes</li>
              <li>🗄️ Supabase PostgreSQL</li>
              <li>✔️ Zod 数据验证</li>
              <li>🔐 RLS 行级安全</li>
              <li>📝 结构化日志系统</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white max-w-7xl mx-auto rounded-lg p-8 my-12 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🚀 快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold mb-2">1. 执行数据库迁移</div>
            <p className="text-sm opacity-90">
              在 Supabase SQL Editor 中运行 database-migrations.sql
            </p>
          </div>
          <div>
            <div className="font-bold mb-2">2. 启动开发服务器</div>
            <p className="text-sm opacity-90">运行 npm run dev 启动服务器</p>
          </div>
          <div>
            <div className="font-bold mb-2">3. 开始使用</div>
            <p className="text-sm opacity-90">
              所有 API 端点现在可用，开始集成到你的应用
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">Woowonjae Studio - Phase 2 API 演示</p>
          <p className="text-gray-400 text-sm">
            完整的前端+后端集成，包含用户交互、内容管理和社交功能
          </p>
        </div>
      </div>
    </div>
  );
}
