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

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({
        antialias: true, // 启用抗锯齿以提高视觉质量
        alpha: true,
      });
      renderer.setSize(400, 400); // 增加渲染尺寸以提高视觉质量
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 提高像素比率以提高视觉质量
      renderer.shadowMap.enabled = true; // 启用阴影
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用软阴影
      container.appendChild(renderer.domElement);
      renderers[index] = renderer;

      // 创建控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5; // 适中的旋转速度
      controls.enableDamping = true; // 启用阻尼以获得更平滑的交互
      controls.dampingFactor = 0.05;
      controlsArray.current[index] = controls;

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // 加载纹理
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(album.coverUrl, (texture) => {
        // 设置纹理过滤以提高质量
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // 创建一个更精细的盒子几何体
        const geometry = new THREE.BoxGeometry(1, 1, 0.1, 32, 32, 1);

        // 创建更高质量的材质
        const materials = [
          new THREE.MeshPhongMaterial({ map: texture }), // right
          new THREE.MeshPhongMaterial({ map: texture }), // left
          new THREE.MeshPhongMaterial({ map: texture }), // top
          new THREE.MeshPhongMaterial({ map: texture }), // bottom
          new THREE.MeshPhongMaterial({ map: texture }), // front
          new THREE.MeshPhongMaterial({ map: texture }), // back
        ];

        const album3D = new THREE.Mesh(geometry, materials);
        album3D.castShadow = true;
        album3D.receiveShadow = true;
        scene.add(album3D);

        // 动画循环
        const animate = () => {
          requestAnimationFrame(animate);
          // 只在需要时更新控制器以提高性能
          if (controls.autoRotate || controls.enableDamping) {
            controls.update();
          }
          renderer.render(scene, camera);
        };
        animate();
      });

      // 禁用所有鼠标交互事件
      // 始终保持自动旋转，不受鼠标事件影响
    });

    // 清理函数
    return () => {
      renderers.forEach((renderer) => {
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
            className="w-[400px] h-[400px] relative rounded-lg overflow-hidden"
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
