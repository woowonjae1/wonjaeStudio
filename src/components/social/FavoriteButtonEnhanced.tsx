'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { isFavorited, addFavorite, removeFavorite, getFavorites } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FavoriteButtonEnhancedProps {
  itemType: 'album' | 'post' | 'track';
  itemId: string;
}

export function FavoriteButtonEnhanced({ itemType, itemId }: FavoriteButtonEnhancedProps) {
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleToggle}
        disabled={loading}
        variant={favorited ? 'default' : 'outline'}
        className={`
          group relative overflow-hidden
          ${favorited 
            ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-none' 
            : 'border-2 hover:border-pink-500 dark:border-gray-700'
          }
          transition-all duration-300
        `}
      >
        <span className="flex items-center space-x-2">
          <motion.svg
            className="w-5 h-5"
            fill={favorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={favorited ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
          <span className="font-semibold">{favorited ? '已收藏' : '收藏'}</span>
        </span>
      </Button>
    </motion.div>
  );
}

