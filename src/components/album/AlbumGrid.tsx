import React, { useEffect, useRef, useState } from 'react';
import { Album } from '@/types';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface AlbumGridProps {
  albums: Album[];
  onPlayAlbum: (album: Album) => void;
  currentAlbum: Album | null;
  isPlaying: boolean;
}

// 获取图片主色
function getDominantColor(imageUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(0x888888);
      ctx.drawImage(img, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      resolve((r << 16) + (g << 8) + b);
    };
    img.onerror = function () {
      resolve(0x888888);
    };
  });
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums, onPlayAlbum, currentAlbum, isPlaying }) => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const controlsArray = useRef<OrbitControls[]>([]);
  const animationFrames = useRef<number[]>([]);
  const dominantColors = useRef<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 4; // 每页显示4个专辑
  
  // 计算总页数
  const totalPages = Math.ceil(albums.length / albumsPerPage);
  
  // 获取当前页显示的专辑
  const currentAlbums = albums.slice(
    (currentPage - 1) * albumsPerPage,
    currentPage * albumsPerPage
  );
  
  // 页面切换处理函数
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const scenes: THREE.Scene[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    const renderers: THREE.WebGLRenderer[] = [];

    animationFrames.current.forEach(id => cancelAnimationFrame(id));
    animationFrames.current = [];

    currentAlbums.forEach((album, index) => {
      const container = containerRefs.current[index];
      if (!container) return;
      const oldCanvas = container.querySelector('canvas');
      if (oldCanvas) {
        container.removeChild(oldCanvas);
      }

      try {
        const scene = new THREE.Scene();
        scenes[index] = scene;
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.z = 2.5;
        cameras[index] = camera;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(350, 350);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // 禁用Canvas的鼠标事件
        renderer.domElement.style.pointerEvents = 'none';
        
        renderers[index] = renderer;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = false; // 禁止用户手动旋转
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.1;
        controlsArray.current[index] = controls;

        // 先获取主色再加载纹理
        getDominantColor(album.coverUrl).then((coverColor) => {
          dominantColors.current[index] = coverColor;
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(album.coverUrl, (texture) => {
            // 材质：正反面封面，侧面主色
            const materials = [
              new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.22, metalness: 0.35 }), // right
              new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.22, metalness: 0.35 }), // left
              new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.22, metalness: 0.35 }), // top
              new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.22, metalness: 0.35 }), // bottom
              new THREE.MeshStandardMaterial({ map: texture, roughness: 0.13, metalness: 0.18 }), // front
              new THREE.MeshStandardMaterial({ map: texture, roughness: 0.13, metalness: 0.18 }), // back
            ];
            // 更大更薄的盒子
            const geometry = new THREE.BoxGeometry(1, 1, 0.06);
            const album3D = new THREE.Mesh(geometry, materials);
            scene.add(album3D);
            // 更亮的环境光
            scene.add(new THREE.AmbientLight(0xffffff, 1.8));
            const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
            mainLight.position.set(2, 2, 3);
            scene.add(mainLight);
            const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
            backLight.position.set(-2, 2, -3);
            scene.add(backLight);
            // 添加额外的顶部点光源，增强亮度
            const topLight = new THREE.PointLight(0xffffff, 1.0);
            topLight.position.set(0, 5, 2);
            scene.add(topLight);
            // 增加材质的亮度
            materials.forEach(material => {
              if (material.map) {
                material.emissive = new THREE.Color(0x222222);
                material.emissiveIntensity = 0.2;
              }
            });
            // 动画
            const animate = () => {
              if (scene && camera && renderer && controls) {
                const frameId = requestAnimationFrame(animate);
                animationFrames.current[index] = frameId;
                controls.update();
                renderer.render(scene, camera);
              }
            };
            animate();
          });
        });
      } catch (error) {
        console.error(`Error initializing 3D for album ${album.title}:`, error);
      }
    });
    return () => {
      animationFrames.current.forEach(id => cancelAnimationFrame(id));
      animationFrames.current = [];
      renderers.forEach(renderer => {
        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      });
      controlsArray.current = [];
    };
  }, [currentAlbums, currentPage]);

  // 重置容器引用数组
  containerRefs.current = [];

  // 添加页面样式
  useEffect(() => {
    // 添加动画按钮样式
    const style = document.createElement('style');
    style.innerHTML = `
      .animated-button {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 16px 36px;
        border: 4px solid;
        border-color: transparent;
        font-size: 16px;
        background-color: inherit;
        border-radius: 100px;
        font-weight: 600;
        color: #3b82f6;
        box-shadow: 0 0 0 2px #3b82f6;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
      }

      .animated-button svg {
        position: absolute;
        width: 24px;
        fill: #3b82f6;
        z-index: 9;
        transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
      }

      .animated-button .arr-1 {
        right: 16px;
      }

      .animated-button .arr-2 {
        left: -25%;
      }

      .animated-button .circle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border-radius: 50%;
        opacity: 0;
        transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
      }

      .animated-button .text {
        position: relative;
        z-index: 1;
        transform: translateX(-12px);
        transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
      }

      .animated-button:hover {
        box-shadow: 0 0 0 12px transparent;
        color: #212121;
        border-radius: 12px;
      }

      .animated-button:hover .arr-1 {
        right: -25%;
      }

      .animated-button:hover .arr-2 {
        left: 16px;
      }

      .animated-button:hover .text {
        transform: translateX(12px);
      }

      .animated-button:hover svg {
        fill: #212121;
      }

      .animated-button:active {
        scale: 0.95;
        box-shadow: 0 0 0 4px #3b82f6;
      }

      .animated-button:hover .circle {
        width: 220px;
        height: 220px;
        opacity: 1;
      }
      
      .animated-button:disabled {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    // 清理函数
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {currentAlbums.map((album, index) => (
          <div key={album.id} className="flex flex-col items-center">
            <div
              ref={(el) => {
                if (el) containerRefs.current[index] = el;
              }}
              className="w-[350px] h-[350px] relative rounded-lg overflow-hidden pointer-events-none"
            />
            <div className="mt-1 text-center">
              <h3 className="text-lg font-semibold text-black mb-1">{album.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{album.artist}</p>
              <button
                onClick={() => onPlayAlbum(album)}
                className="px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                {currentAlbum?.id === album.id && isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            上一页
          </button>
          
          <div className="flex items-center gap-2 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default AlbumGrid;