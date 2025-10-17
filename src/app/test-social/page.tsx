'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CommentSectionEnhanced } from '@/components/social/CommentSectionEnhanced';
import { FavoriteButtonEnhanced } from '@/components/social/FavoriteButtonEnhanced';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestSocialPage() {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<'album1' | 'album2' | 'post1'>('album1');

  // 测试数据 - 使用真实的 UUID 格式
  const testItems = {
    album1: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      type: 'album' as const,
      title: '测试专辑 1 - Romantic Vibes',
      description: '一张充满浪漫氛围的专辑',
    },
    album2: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      type: 'album' as const,
      title: '测试专辑 2 - Summer Beats',
      description: '夏日节拍精选集',
    },
    post1: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      type: 'post' as const,
      title: '测试文章 - AI in Music Production',
      description: 'AI技术如何改变音乐制作',
    },
  };

  const currentItem = testItems[selectedItem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Social Features Test</h1>
            <div className="flex items-center space-x-4">
              <Link href="/home">
                <Button variant="outline">Back to Home</Button>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Please login to test features
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* 说明卡片 */}
        <Card className="mb-8 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>功能测试说明</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>评论功能</strong>：发表评论、回复评论、删除评论（需要登录）</p>
            <p>✅ <strong>收藏功能</strong>：收藏/取消收藏内容（需要登录）</p>
            <p>💡 <strong>提示</strong>：切换不同的测试项目，查看独立的评论和收藏状态</p>
            <p>📊 <strong>数据</strong>：所有数据存储在 Supabase，可在 Dashboard 查看</p>
          </CardContent>
        </Card>

        {/* 选择测试项目 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">选择测试项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(testItems).map(([key, item]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedItem === key
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedItem(key as any)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        {item.type}
                      </div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    {selectedItem === key && (
                      <div className="ml-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    ID: {item.id}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 当前项目详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧 - 项目信息和收藏 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>当前项目</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Type</div>
                  <div className="font-semibold capitalize">{currentItem.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Title</div>
                  <div className="font-semibold">{currentItem.title}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Description</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentItem.description}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-2">Item ID</div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block break-all">
                    {currentItem.id}
                  </code>
                </div>

                {/* 收藏按钮 */}
                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 uppercase mb-3">Favorite Action</div>
                  <FavoriteButtonEnhanced
                    itemId={currentItem.id}
                    itemType={currentItem.type}
                  />
                </div>

                {/* 用户状态 */}
                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 uppercase mb-2">User Status</div>
                  {user ? (
                    <div className="text-sm">
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Logged In</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                        {user.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Please login to use features
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧 - 评论区 */}
          <div className="lg:col-span-2">
            <CommentSectionEnhanced
              itemId={currentItem.id}
              itemType={currentItem.type}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

