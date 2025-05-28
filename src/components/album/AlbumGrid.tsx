import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const scenes: THREE.Scene[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    const renderers: THREE.WebGLRenderer[] = [];

    animationFrames.current.forEach(id => cancelAnimationFrame(id));
    animationFrames.current = [];

    albums.forEach((album, index) => {
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
        renderers[index] = renderer;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.1;
        controls.rotateSpeed = 0.7;
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
            scene.add(new THREE.AmbientLight(0xffffff, 1.1));
            const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
            mainLight.position.set(2, 2, 3);
            scene.add(mainLight);
            const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
            backLight.position.set(-2, 2, -3);
            scene.add(backLight);
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
        container.addEventListener('mouseenter', () => {
          if (controlsArray.current[index]) controlsArray.current[index].autoRotate = false;
        });
        container.addEventListener('mouseleave', () => {
          if (controlsArray.current[index]) controlsArray.current[index].autoRotate = true;
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
  }, [albums]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {albums.map((album, index) => (
        <div key={album.id} className="flex flex-col items-center">
          <div
            ref={(el) => {
              if (el) containerRefs.current[index] = el;
            }}
            className="w-[350px] h-[350px] relative cursor-pointer rounded-lg overflow-hidden"
            onClick={() => onPlayAlbum(album)}
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
  );
};

export default AlbumGrid;