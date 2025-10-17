'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { getComments, createComment, deleteComment } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicCard } from '@/components/ui/magic-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  };
  user_id: string;
}

interface CommentSectionEnhancedProps {
  itemType: 'album' | 'post' | 'track';
  itemId: string;
}

export function CommentSectionEnhanced({ itemType, itemId }: CommentSectionEnhancedProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [itemType, itemId]);

  const loadComments = async () => {
    try {
      const data = await getComments(itemType, itemId);
      setComments(data as any);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const comment = await createComment({
        content: newComment,
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
      });
      setComments([...comments, comment as any]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('确定删除这条评论吗？')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        评论 ({comments.length})
      </h3>

      {/* 评论输入框 */}
      {user ? (
        <MagicCard
          gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
          className="p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="comment" className="text-base font-semibold mb-2">
                发表你的看法
              </Label>
              <Input
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="mt-2 min-h-[80px] resize-none"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {submitting ? '提交中...' : '发表评论'}
            </Button>
          </form>
        </MagicCard>
      ) : (
        <MagicCard
          gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
          className="p-6 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            登录后即可发表评论
          </p>
          <Button variant="outline">登录</Button>
        </MagicCard>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无评论，来发表第一条吧！
            </p>
          </Card>
        ) : (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <MagicCard
                  gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {comment.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-bold text-lg">
                            {comment.profiles?.display_name || '匿名用户'}
                          </p>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    {user?.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

