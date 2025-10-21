"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Album {
  id: string;
  title: string;
  artist?: string;
  cover_url?: string;
  release_date?: string;
  tracks?: Array<{ id: string; title: string; duration: number }>;
}

interface AlbumWithStats extends Album {
  likeCount?: number;
  commentCount?: number;
  favoriteCount?: number;
  isFavorited?: boolean;
  isLiked?: boolean;
}

export function AlbumListEnhanced() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<AlbumWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAlbum, setCurrentAlbum] = useState<AlbumWithStats | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [likedAlbumIds, setLikedAlbumIds] = useState<Set<string>>(new Set());
  const [favoritedAlbumIds, setFavoritedAlbumIds] = useState<Set<string>>(
    new Set()
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载专辑列表
  const fetchAlbums = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/albums?page=${pageNum}&limit=8`);
      const result = await response.json();

      if (result.success) {
        if (pageNum === 1) {
          setAlbums(result.data.items || []);
        } else {
          setAlbums((prev) => [...prev, ...(result.data.items || [])]);
        }
        setHasMore(result.data.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    fetchAlbums(1);
  }, []);

  // 播放专辑
  const playAlbum = (album: AlbumWithStats) => {
    setCurrentAlbum(album);
    setShowPlayer(true);

    if (currentAlbum?.id === album.id) {
      togglePlay();
    } else {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  // 切换播放
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 处理进度条
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 关闭播放器
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setShowPlayer(false);
  };

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (audio.duration) setDuration(audio.duration);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentAlbum]);

  // 点赞
  const handleLike = async (albumId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("请先登录");
      return;
    }

    try {
      const isLiked = likedAlbumIds.has(albumId);
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          item_type: "album",
          item_id: albumId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 更新状态
        if (result.data.favorited) {
          setLikedAlbumIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(albumId);
            return newSet;
          });
        } else {
          setLikedAlbumIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(albumId);
            return newSet;
          });
        }

        // 更新数据
        setAlbums((prev) =>
          prev.map((album) =>
            album.id === albumId
              ? {
                  ...album,
                  likeCount:
                    (album.likeCount || 0) + (result.data.favorited ? 1 : -1),
                }
              : album
          )
        );
      }
    } catch (error) {
      console.error("Failed to like album:", error);
    }
  };

  // 收藏
  const handleFavorite = async (albumId: string, e: React.MouseEvent) => {
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
          item_type: "album",
          item_id: albumId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.favorited) {
          setFavoritedAlbumIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(albumId);
            return newSet;
          });
        } else {
          setFavoritedAlbumIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(albumId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error("Failed to favorite album:", error);
    }
  };

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-8">音乐库</h2>

      {/* 专辑网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => playAlbum(album)}
          >
            {/* 专辑封面 */}
            <div className="relative w-56 h-56 mb-4 overflow-hidden rounded-lg">
              <Image
                src={
                  album.cover_url ||
                  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop"
                }
                alt={album.title}
                width={200}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* 悬停时显示的操作按钮 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAlbum(album);
                  }}
                  className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="播放"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>

                <button
                  onClick={(e) => handleLike(album.id, e)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    likedAlbumIds.has(album.id)
                      ? "bg-red-500 text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                  title="点赞"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={likedAlbumIds.has(album.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <button
                  onClick={(e) => handleFavorite(album.id, e)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    favoritedAlbumIds.has(album.id)
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                  title="收藏"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={
                      favoritedAlbumIds.has(album.id) ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 10.26 24 10.5 17.77 16.61 20.16 25.5 12 20.09 3.84 25.5 6.23 16.61 0 10.5 8.91 10.26 12 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>

            {/* 专辑信息 */}
            <h3 className="text-lg font-medium text-center mb-1">
              {album.title}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-3">
              {album.artist}
            </p>

            {/* 统计信息 */}
            <div className="flex gap-4 text-sm text-gray-600 text-center">
              <div>
                <div className="font-bold text-black">
                  {album.likeCount || 0}
                </div>
                <div className="text-xs">点赞</div>
              </div>
              <div>
                <div className="font-bold text-black">
                  {album.favoriteCount || 0}
                </div>
                <div className="text-xs">收藏</div>
              </div>
              <div>
                <div className="font-bold text-black">
                  {album.commentCount || 0}
                </div>
                <div className="text-xs">评论</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchAlbums(nextPage);
            }}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            加载更多
          </button>
        </div>
      )}

      {/* 音频播放器 */}
      {showPlayer && currentAlbum && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 text-white border-t border-gray-700 shadow-2xl p-4">
          <audio
            ref={audioRef}
            src={
              currentAlbum.tracks?.[0]
                ? `/api/albums/${currentAlbum.id}`
                : undefined
            }
            preload="metadata"
          />

          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {/* 专辑信息 */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Image
                src={
                  currentAlbum.cover_url ||
                  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop"
                }
                alt={currentAlbum.title}
                width={56}
                height={56}
                className="rounded-md"
              />
              <div>
                <h4 className="font-bold text-sm">{currentAlbum.title}</h4>
                <p className="text-xs text-gray-400">{currentAlbum.artist}</p>
              </div>
            </div>

            {/* 播放器控制 */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={closePlayer}
              className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
