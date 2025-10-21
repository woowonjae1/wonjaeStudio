"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  item_type: string;
  item_id: string;
  parent_id?: string;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface CommentSectionAdvancedProps {
  itemType: "album" | "post" | "user";
  itemId: string;
  title?: string;
}

export function CommentSectionAdvanced({
  itemType,
  itemId,
  title,
}: CommentSectionAdvancedProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载评论
  const loadComments = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/comments?item_type=${itemType}&item_id=${itemId}&page=${pageNum}&limit=10`
      );
      const result = await response.json();

      if (result.success) {
        if (pageNum === 1) {
          setComments(result.data.items || []);
        } else {
          setComments((prev) => [...prev, ...(result.data.items || [])]);
        }
        setHasMore(result.data.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    loadComments(1);
  }, [itemType, itemId]);

  // 提交评论
  const handleSubmitComment = async () => {
    if (!user) {
      alert("请先登录");
      return;
    }

    if (!newComment.trim()) {
      alert("评论不能为空");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          content: newComment,
          item_type: itemType,
          item_id: itemId,
          parent_id: replyingTo || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (replyingTo) {
          // 添加回复
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === replyingTo
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), result.data],
                  }
                : comment
            )
          );
          setReplyContent("");
          setReplyingTo(null);
        } else {
          // 添加顶级评论
          setComments((prev) => [result.data, ...prev]);
          setNewComment("");
        }
      } else {
        alert(result.error?.message || "提交失败");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("确定要删除这条评论吗？")) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        alert(result.error?.message || "删除失败");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // 格式化时间
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}

      {/* 评论输入框 */}
      {user ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-3">
            <Image
              src={
                user.user_metadata?.avatar_url ||
                "https://via.placeholder.com/40"
              }
              alt={user.email || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="说出你的想法..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => setNewComment("")}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "提交中..." : "发表评论"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
          <a href="/auth/login" className="underline font-bold">
            登录
          </a>
          后可以发表评论
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500">暂无评论</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-b-0">
              {/* 评论 */}
              <div className="flex gap-3">
                <Image
                  src={
                    comment.user?.avatar_url || "https://via.placeholder.com/40"
                  }
                  alt={comment.user?.display_name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">
                        {comment.user?.display_name || "匿名用户"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatTime(comment.created_at)}
                      </p>
                    </div>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{comment.content}</p>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    回复
                  </button>
                </div>
              </div>

              {/* 回复输入框 */}
              {replyingTo === comment.id && (
                <div className="ml-12 mt-3 p-3 bg-gray-50 rounded-lg">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="写下你的回复..."
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-200 rounded"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setNewComment(replyContent);
                        handleSubmitComment();
                      }}
                      disabled={submitting || !replyContent.trim()}
                      className="text-xs px-3 py-1 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                      回复
                    </button>
                  </div>
                </div>
              )}

              {/* 嵌套回复 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-3 space-y-3 border-l-2 border-gray-200 pl-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2">
                      <Image
                        src={
                          reply.user?.avatar_url ||
                          "https://via.placeholder.com/32"
                        }
                        alt={reply.user?.display_name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs">
                            {reply.user?.display_name || "匿名用户"}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 加载更多 */}
      {hasMore && comments.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              loadComments(nextPage);
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            加载更多评论
          </button>
        </div>
      )}
    </div>
  );
}
