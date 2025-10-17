'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth, signOut } from '@/hooks/useAuth';
import { getFavorites, getPlayHistory } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';

export default function DashboardEnhancedPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [playHistory, setPlayHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      loadUserData();
    }
  }, [user, loading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [favs, history] = await Promise.all([
        getFavorites(user.id),
        getPlayHistory(user.id, 10),
      ]);
      setFavorites(favs);
      setPlayHistory(history);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* 用户信息卡片 */}
          <motion.div variants={itemVariants}>
            <MagicCard
              gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
              className="p-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {user.user_metadata?.display_name || '用户'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                        {favorites.length} 收藏
                      </span>
                      <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-semibold">
                        {playHistory.length} 播放
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  退出登录
                </Button>
              </div>
            </MagicCard>
          </motion.div>

          {/* Tab 切换 */}
          <motion.div variants={itemVariants} className="flex space-x-4">
            <Button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              我的收藏
            </Button>
            <Button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              播放历史
            </Button>
          </motion.div>

          {/* 内容区域 */}
          <motion.div variants={itemVariants}>
            {activeTab === 'favorites' ? (
              <MagicCard
                gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
                className="p-8"
              >
                <h2 className="text-2xl font-bold mb-6">我的收藏 ({favorites.length})</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💝</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      还没有收藏任何内容
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((fav, index) => (
                      <motion.div
                        key={fav.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="hover:shadow-xl transition-shadow duration-300 border-2">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 capitalize">{fav.item_type}</div>
                                <div className="font-semibold">ID: {fav.item_id.substring(0, 8)}...</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 mt-4">
                              {new Date(fav.created_at).toLocaleDateString('zh-CN')}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </MagicCard>
            ) : (
              <MagicCard
                gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
                className="p-8"
              >
                <h2 className="text-2xl font-bold mb-6">播放历史</h2>
                {playHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎵</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      还没有播放记录
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playHistory.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-lg">
                                    {record.albums?.title || 'Unknown Album'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {record.tracks?.title || 'Track'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(record.played_at).toLocaleString('zh-CN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </MagicCard>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

