"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  category?: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at?: string;
  stats?: {
    likeCount: number;
    commentCount: number;
    favoriteCount: number;
  };
}

interface PostListAdvancedProps {
  category?: string;
  showDetail?: boolean;
  postSlug?: string;
}

export function PostListAdvanced({
  category,
  showDetail = false,
  postSlug,
}: PostListAdvancedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [favoritedPostIds, setFavoritedPostIds] = useState<Set<string>>(
    new Set()
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载文章列表
  const loadPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      let url = `/api/posts?page=${pageNum}&limit=6`;
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        if (pageNum === 1) {
          setPosts(result.data.items || []);
        } else {
          setPosts((prev) => [...prev, ...(result.data.items || [])]);
        }
        setHasMore(result.data.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 加载文章详情
  const loadPostDetail = async (slug: string) => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      const result = await response.json();

      if (result.success) {
        setSelectedPost(result.data);
      }
    } catch (error) {
      console.error("Failed to load post detail:", error);
    }
  };

  // 初始化
  useEffect(() => {
    if (postSlug) {
      loadPostDetail(postSlug);
    } else {
      loadPosts(1);
    }
  }, [postSlug, category]);

  // 点赞
  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("请先登录");
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          item_type: "post",
          item_id: postId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.favorited) {
          setLikedPostIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
          });
        } else {
          setLikedPostIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  // 收藏
  const handleFavorite = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("请先登录");
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          item_type: "post",
          item_id: postId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.favorited) {
          setFavoritedPostIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
          });
        } else {
          setFavoritedPostIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error("Failed to favorite post:", error);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 详情视图
  if (showDetail && selectedPost) {
    return (
      <article className="max-w-2xl mx-auto">
        {/* 文章头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{selectedPost.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Image
              src={
                selectedPost.author?.avatar_url ||
                "https://via.placeholder.com/48"
              }
              alt={selectedPost.author?.display_name || "Author"}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-bold">
                {selectedPost.author?.display_name || "匿名作者"}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedPost.created_at)}
              </p>
            </div>
          </div>

          {selectedPost.cover_image && (
            <Image
              src={selectedPost.cover_image}
              alt={selectedPost.title}
              width={800}
              height={400}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
        </header>

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-8">
          <p>{selectedPost.content}</p>
        </div>

        {/* 文章操作 */}
        <div className="flex gap-4 mb-8 border-y py-4">
          <button
            onClick={(e) => handleLike(selectedPost.id, e)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              likedPostIds.has(selectedPost.id)
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={likedPostIds.has(selectedPost.id) ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{selectedPost.stats?.likeCount || 0} 赞</span>
          </button>

          <button
            onClick={(e) => handleFavorite(selectedPost.id, e)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              favoritedPostIds.has(selectedPost.id)
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={
                favoritedPostIds.has(selectedPost.id) ? "currentColor" : "none"
              }
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 10.26 24 10.5 17.77 16.61 20.16 25.5 12 20.09 3.84 25.5 6.23 16.61 0 10.5 8.91 10.26 12 2"></polygon>
            </svg>
            <span>{selectedPost.stats?.favoriteCount || 0} 收藏</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{selectedPost.stats?.commentCount || 0} 条评论</span>
          </button>
        </div>

        {/* 评论区 */}
        {/* TODO: 实现评论功能 */}
        {/* <CommentSectionAdvanced
          itemType="post"
          itemId={selectedPost.id}
          title="评论"
        /> */}
      </article>
    );
  }

  // 列表视图
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">文章</h2>

      {/* 文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            {/* 封面 */}
            {post.cover_image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {post.category && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {post.category}
                  </div>
                )}
              </div>
            )}

            {/* 内容 */}
            <div className="p-4">
              <Link href={`/posts/${post.slug}`}>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.excerpt || post.content?.substring(0, 100)}
              </p>

              {/* 作者信息 */}
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                {post.author?.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.display_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{post.author?.display_name || "匿名"}</span>
                <span>·</span>
                <span>{formatDate(post.created_at)}</span>
              </div>

              {/* 交互按钮 */}
              <div className="flex gap-2 border-t pt-3">
                <button
                  onClick={(e) => handleLike(post.id, e)}
                  className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    likedPostIds.has(post.id)
                      ? "bg-red-100 text-red-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={likedPostIds.has(post.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {post.stats?.likeCount || 0}
                </button>

                <button
                  onClick={(e) => handleFavorite(post.id, e)}
                  className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    favoritedPostIds.has(post.id)
                      ? "bg-yellow-100 text-yellow-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={
                      favoritedPostIds.has(post.id) ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 10.26 24 10.5 17.77 16.61 20.16 25.5 12 20.09 3.84 25.5 6.23 16.61 0 10.5 8.91 10.26 12 2"></polygon>
                  </svg>
                  {post.stats?.favoriteCount || 0}
                </button>

                <button className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {post.stats?.commentCount || 0}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              loadPosts(nextPage);
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            加载更多
          </button>
        </div>
      )}

      {loading && posts.length === 0 && (
        <div className="text-center text-gray-500">加载中...</div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center text-gray-500">暂无文章</div>
      )}
    </div>
  );
}
