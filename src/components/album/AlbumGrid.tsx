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

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums, onPlayAlbum, currentAlbum, isPlaying }) => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const controlsArray = useRef<OrbitControls[]>([]);

  useEffect(() => {
    const scenes: THREE.Scene[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    const renderers: THREE.WebGLRenderer[] = [];

    albums.forEach((album, index) => {
      const container = containerRefs.current[index];
      if (!container) return;

      // 创建场景
      const scene = new THREE.Scene();
      scenes[index] = scene;

      // 调整相机参数
      const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000); // 减小视角
      camera.position.z = 1.5; // 调近相机距离
      cameras[index] = camera;

      // 创建渲染器，增加尺寸
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
      });
      renderer.setSize(400, 400); // 增加渲染尺寸
      container.appendChild(renderer.domElement);
      renderers[index] = renderer;

      // 创建控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0; // 稍微降低旋转速度
      controlsArray.current[index] = controls;

      // 加载纹理
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(album.image, (texture) => {
        // 创建一个盒子几何体（添加厚度）
        const geometry = new THREE.BoxGeometry(1, 1, 0.05);
        
        // 创建材质数组，使用原图的纹理
        const materials = [
          new THREE.MeshBasicMaterial({ map: texture }), // right
          new THREE.MeshBasicMaterial({ map: texture }), // left
          new THREE.MeshBasicMaterial({ map: texture }), // top
          new THREE.MeshBasicMaterial({ map: texture }), // bottom
          new THREE.MeshBasicMaterial({ map: texture }), // front
          new THREE.MeshBasicMaterial({ map: texture }), // back
        ];

        const album3D = new THREE.Mesh(geometry, materials);
        scene.add(album3D);

        // 动画循环
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      });

      // 添加鼠标事件：移上去静止，移开恢复旋转
      container.addEventListener('mouseenter', () => {
        if (controlsArray.current[index]) {
          controlsArray.current[index].autoRotate = false;
        }
      });

      container.addEventListener('mouseleave', () => {
        if (controlsArray.current[index]) {
          controlsArray.current[index].autoRotate = true;
          controlsArray.current[index].autoRotateSpeed = 2.0;
        }
      });
    });

    // 清理函数
    return () => {
      renderers.forEach(renderer => {
        if (renderer.domElement && renderer.domElement.parentNode) {
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
            className="w-[400px] h-[400px] relative cursor-pointer rounded-lg overflow-hidden"
            onClick={() => onPlayAlbum(album)}
          />
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium">{album.title}</h3>
            <button
              onClick={() => onPlayAlbum(album)}
              className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
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