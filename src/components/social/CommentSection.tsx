'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getComments, createComment, deleteComment } from '@/services/supabaseService';

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

interface CommentSectionProps {
  itemType: 'album' | 'post' | 'track';
  itemId: string;
}

export default function CommentSection({ itemType, itemId }: CommentSectionProps) {
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

  const handleDelete = async (commentId: string) {
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
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">评论 ({comments.length})</h3>

      {/* 评论表单 */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? '提交中...' : '发表评论'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">请先登录后再评论</p>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无评论</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {comment.profiles?.display_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold">{comment.profiles?.display_name || '匿名用户'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    删除
                  </button>
                )}
              </div>
              <p className="mt-3 text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

