"use client";

import { FC, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface AlbumMeshProps {
  imageSrc: string;
}

const AlbumMesh: FC<AlbumMeshProps> = ({ imageSrc }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageSrc);

  useFrame(() => {
    if (meshRef.current) {
      // 添加平滑的旋转动画
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

interface ThreeJSAlbumRendererProps {
  imageSrc: string;
  albumId?: string;
  onLike?: (albumId: string) => void;
  onFavorite?: (albumId: string) => void;
  onPlay?: (albumId: string) => void;
}

const ThreeJSAlbumRenderer: FC<ThreeJSAlbumRendererProps> = ({
  imageSrc,
  albumId,
  onLike,
  onFavorite,
  onPlay,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 从 localStorage 加载状态
  useEffect(() => {
    if (albumId) {
      const liked = localStorage.getItem(`album_liked_${albumId}`) === "true";
      const favorited =
        localStorage.getItem(`album_favorited_${albumId}`) === "true";
      setIsLiked(liked);
      setIsFavorited(favorited);
    }
  }, [albumId]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    if (albumId) {
      localStorage.setItem(`album_liked_${albumId}`, String(newLikedState));
      if (newLikedState && onLike) {
        onLike(albumId);
      }
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    if (albumId) {
      localStorage.setItem(
        `album_favorited_${albumId}`,
        String(newFavoritedState)
      );
      if (newFavoritedState && onFavorite) {
        onFavorite(albumId);

        // 保存到收藏历史
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const albumData = JSON.parse(
          localStorage.getItem(`album_data_${albumId}`) || "{}"
        );
        if (!favorites.find((f: any) => f.id === albumId)) {
          favorites.push({
            id: albumId,
            ...albumData,
            favoritedAt: new Date().toISOString(),
          });
          localStorage.setItem("favorites", JSON.stringify(favorites));
        }
      } else {
        // 从收藏历史移除
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const updatedFavorites = favorites.filter((f: any) => f.id !== albumId);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }
    }
  };

  // 处理点击专辑封面 - 记录播放历史
  const handleAlbumClick = () => {
    if (albumId) {
      setIsPlaying(true);

      // 记录播放历史
      const playHistory = JSON.parse(
        localStorage.getItem("playHistory") || "[]"
      );
      const albumData = JSON.parse(
        localStorage.getItem(`album_data_${albumId}`) || "{}"
      );

      // 添加新的播放记录到历史开头
      playHistory.unshift({
        id: albumId,
        ...albumData,
        playedAt: new Date().toISOString(),
      });

      // 限制历史记录数量为100条
      if (playHistory.length > 100) {
        playHistory.pop();
      }

      localStorage.setItem("playHistory", JSON.stringify(playHistory));

      if (onPlay) {
        onPlay(albumId);
      }

      // 3秒后重置播放状态
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div
      className="relative w-full h-full group cursor-pointer"
      onClick={handleAlbumClick}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <AlbumMesh imageSrc={imageSrc} />
        </Canvas>
      </div>

      {/* 播放中的指示器 */}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-white text-lg font-bold animate-pulse">
            ▶ 正在播放...
          </div>
        </div>
      )}

      {/* 点赞和收藏按钮 */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* 点赞按钮 - 爱心 */}
        <button
          onClick={handleLike}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isLiked
              ? "bg-red-500/80 text-white scale-110"
              : "bg-white/60 text-gray-700 hover:bg-white/80"
          }`}
          aria-label="点赞"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* 收藏按钮 - 星星 */}
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorited
              ? "bg-yellow-500/80 text-white scale-110"
              : "bg-white/60 text-gray-700 hover:bg-white/80"
          }`}
          aria-label="收藏"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ThreeJSAlbumRenderer;
