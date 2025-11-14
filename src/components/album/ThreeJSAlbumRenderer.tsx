'use client';

import { FC, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

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
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <planeGeometry args={[3, 3, 32, 32]} />
      <meshPhongMaterial
        map={texture}
        side={THREE.DoubleSide}
        shininess={100}
        emissive={0x444444}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
};

interface ThreeJSAlbumRendererProps {
  imageSrc: string;
  albumId?: string;
  onFavorite?: (albumId: string) => void;
}

const ThreeJSAlbumRenderer: FC<ThreeJSAlbumRendererProps> = ({ imageSrc, albumId, onFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // 从 localStorage 加载状态
  useEffect(() => {
    if (albumId) {
      const favorited = localStorage.getItem(`album_favorited_${albumId}`) === 'true';
      setIsFavorited(favorited);
    }
  }, [albumId]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    if (albumId) {
      localStorage.setItem(`album_favorited_${albumId}`, String(newFavoritedState));
      if (newFavoritedState && onFavorite) {
        onFavorite(albumId);

        // 保存到收藏历史
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const albumData = JSON.parse(localStorage.getItem(`album_data_${albumId}`) || '{}');
        if (!favorites.find((f: any) => f.id === albumId)) {
          favorites.push({
            id: albumId,
            ...albumData,
            favoritedAt: new Date().toISOString(),
          });
          localStorage.setItem('favorites', JSON.stringify(favorites));
        }
      } else {
        // 从收藏历史移除
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = favorites.filter((f: any) => f.id !== albumId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
    }
  };

  // 处理专辑点击已禁用，不再支持点击交互

  return (
    <div className="relative w-full h-full group">
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 4] }} shadows>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[10, 10, 10]} intensity={1.0} />
          <AlbumMesh imageSrc={imageSrc} />
        </Canvas>
      </div>

      {/* 收藏按钮 */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* 收藏按钮 - 星星 */}
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorited
              ? 'bg-yellow-500/80 text-white scale-110'
              : 'bg-white/60 text-gray-700 hover:bg-white/80'
          }`}
          aria-label="收藏"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorited ? 'currentColor' : 'none'}
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
