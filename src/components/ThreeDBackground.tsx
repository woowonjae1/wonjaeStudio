'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清除之前可能存在的Three.js实例
    const oldCanvas = containerRef.current.querySelector('canvas');
    if (oldCanvas) {
      containerRef.current.removeChild(oldCanvas);
    }

    // 如果之前有动画帧，取消它
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 初始化Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // 创建粒子纹理
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64; // 降低纹理大小以提高性能
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 创建径向渐变
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(200, 200, 255, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 创建粒子系统背景 - 降低粒子数以提高性能
    const particlesCount = 1200; // 从 2000 降低到 1200
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    // 创建粒子位置
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // 使用球面分布创建更均匀的粒子云
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 30 + Math.random() * 40;

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.4, // 略微减小粒子大小
      map: particleTexture || undefined,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      sizeAttenuation: true,
    });

    // 创建粒子系统
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // 创建大型中央光辉
    const glowGeometry = new THREE.PlaneGeometry(60, 60);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4040ff,
      transparent: true,
      opacity: 0.12, // 略微降低透明度
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -10;
    scene.add(glow);

    // 创建小型发光球体 - 减少球体数量和细节
    const createGlowingSphere = (radius: number, color: number, position: THREE.Vector3) => {
      const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16); // 从 32x32 降低到 16x16
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6, // 略微降低透明度
        blending: THREE.AdditiveBlending,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(position);
      scene.add(sphere);
      return sphere;
    };

    // 添加几个发光球体
    const spheres = [
      createGlowingSphere(1, 0x4444ff, new THREE.Vector3(-15, 5, 10)),
      createGlowingSphere(0.8, 0x8844ff, new THREE.Vector3(18, -7, 5)),
      createGlowingSphere(1.2, 0x4488ff, new THREE.Vector3(5, 15, -2)),
      createGlowingSphere(0.6, 0x44ffff, new THREE.Vector3(-8, -12, 8)),
    ];

    // 处理窗口大小变化 - 使用防抖以避免过多调用
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    // 动画循环 - 优化旋转速度
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 整体旋转粒子系统 - 减速旋转以降低计算量
      particleSystem.rotation.x = elapsedTime * 0.02;
      particleSystem.rotation.y = elapsedTime * 0.03;

      // 为发光球添加脉动动画 - 优化动画频率
      spheres.forEach((sphere, i) => {
        const pulseScale = Math.sin(elapsedTime * 0.3 + i * 1.5) * 0.15 + 1.1;
        sphere.scale.set(pulseScale, pulseScale, pulseScale);

        // 减少移动幅度
        sphere.position.x += Math.sin(elapsedTime * 0.15 + i * 0.5) * 0.005;
        sphere.position.y += Math.cos(elapsedTime * 0.1 + i * 0.7) * 0.005;
      });

      // 中央光辉脉动 - 减速脉动
      const glowPulse = Math.sin(elapsedTime * 0.15) * 0.08 + 1;
      glow.scale.set(glowPulse, glowPulse, 1);

      // 渲染场景
      renderer.render(scene, camera);

      // 继续动画循环
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 开始动画
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 释放资源
      particles.dispose();
      particleMaterial.dispose();
      if (particleTexture) particleTexture.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();

      spheres.forEach((sphere) => {
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
      });

      renderer.dispose();
      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(2,0,30,1) 100%)',
      }}
    />
  );
}
