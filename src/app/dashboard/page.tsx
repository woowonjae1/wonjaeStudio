'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, signOut } from '@/hooks/useAuth';
import { getFavorites, getPlayHistory } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShineBorder } from '@/components/ui/shine-border';
import Link from 'next/link';

// 生成随机头像颜色
const getAvatarColor = (email: string) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function DashboardPage() {
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 hover:opacity-80 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-gray-300 dark:border-gray-700"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Profile Card */}
        <Card className="relative overflow-hidden mb-8">
          <ShineBorder shineColor="black" />
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-full ${getAvatarColor(user.email || '')} flex items-center justify-center text-white text-2xl font-bold`}>
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {user.user_metadata?.display_name || 'User'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {favorites.length} Favorites
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {playHistory.length} Plays
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'favorites' ? (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
                <Link href="/" className="inline-block mt-4">
                  <Button variant="outline">Explore Content</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {favorites.map((fav) => (
                  <Card key={fav.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 capitalize mb-1">{fav.item_type}</div>
                          <div className="font-medium">ID: {fav.item_id.substring(0, 8)}...</div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(fav.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {playHistory.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No play history</p>
                <Link href="/" className="inline-block mt-4">
                  <Button variant="outline">Start Listening</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {playHistory.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium mb-1">
                            {record.albums?.title || 'Unknown Album'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.tracks?.title || 'Track'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(record.played_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
