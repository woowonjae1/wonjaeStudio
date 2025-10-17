'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isFavorited, addFavorite, removeFavorite, getFavorites } from '@/services/supabaseService';

interface FavoriteButtonProps {
  itemType: 'album' | 'post' | 'track';
  itemId: string;
}

export default function FavoriteButton({ itemType, itemId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavorite();
    }
  }, [user, itemType, itemId]);

  const checkFavorite = async () => {
    if (!user) return;

    try {
      const favorites = await getFavorites(user.id);
      const favorite = favorites.find(
        (f) => f.item_type === itemType && f.item_id === itemId
      );
      if (favorite) {
        setFavorited(true);
        setFavoriteId(favorite.id);
      }
    } catch (error) {
      console.error('Failed to check favorite:', error);
    }
  };

  const handleToggle = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    setLoading(true);
    try {
      if (favorited && favoriteId) {
        await removeFavorite(favoriteId);
        setFavorited(false);
        setFavoriteId(null);
      } else {
        const favorite = await addFavorite({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
        });
        setFavorited(true);
        setFavoriteId(favorite.id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        favorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } disabled:opacity-50`}
    >
      <svg
        className="w-5 h-5"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{favorited ? '已收藏' : '收藏'}</span>
    </button>
  );
}

