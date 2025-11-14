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

    // 初始化Three.js - 质量优先
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
      precision: 'highp',
      stencil: true,
    });
    rendererRef.current = renderer;

    // 质量优先设置
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // 保持原始像素比以获得最佳质量
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // 禁用所有交互事件
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.userSelect = 'none';
    renderer.domElement.style.cursor = 'default';

    containerRef.current.appendChild(renderer.domElement);

    // 创建高质量粒子纹理
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256; // 提高纹理分辨率
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 创建多层径向渐变以提高质量
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      // 更平滑的颜色过渡
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.1, 'rgba(240, 240, 255, 0.95)');
      gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(100, 150, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 创建高质量粒子系统 - 质量优先
    const particlesCount = 2500; // 增加粒子数量
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    // 创建粒子位置和颜色
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // 使用球面分布创建更均匀的粒子云
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 25 + Math.random() * 50;

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);

      // 添加颜色变化 - 蓝紫色系
      const hue = 0.6 + Math.random() * 0.1; // 蓝紫色范围
      const rgb = hslToRgb(hue, 0.8 + Math.random() * 0.2, 0.5 + Math.random() * 0.3);
      colorArray[i] = rgb.r;
      colorArray[i + 1] = rgb.g;
      colorArray[i + 2] = rgb.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.6,
      map: particleTexture || undefined,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
      vertexColors: true,
      sizeAttenuation: true,
      fog: false,
    });

    // 创建粒子系统
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // 创建多层光辉效果
    const createGlowLayer = (size: number, color: number, opacity: number, zPos: number) => {
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = zPos;
      return mesh;
    };

    // 添加多层光辉
    const glowLayers = [
      createGlowLayer(80, 0x3030ff, 0.1, -15),
      createGlowLayer(60, 0x4444ff, 0.15, -8),
      createGlowLayer(40, 0x6666ff, 0.2, 0),
    ];

    glowLayers.forEach((layer) => {
      scene.add(layer);
    });

    // 创建高质量发光球体
    const createGlowingSphere = (radius: number, color: number, position: THREE.Vector3) => {
      const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64); // 高细节
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        wireframe: false,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(position);

      // 添加发光效果
      const haloGeometry = new THREE.SphereGeometry(radius * 1.3, 32, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(position);
      sphere.userData.halo = halo;

      scene.add(sphere);
      scene.add(halo);
      return sphere;
    };

    // 添加发光球体 - 增加数量
    const spheres = [
      createGlowingSphere(1.2, 0x5555ff, new THREE.Vector3(-20, 8, 15)),
      createGlowingSphere(0.9, 0x7744ff, new THREE.Vector3(22, -10, 8)),
      createGlowingSphere(1.4, 0x4488ff, new THREE.Vector3(8, 18, -5)),
      createGlowingSphere(0.8, 0x44ffff, new THREE.Vector3(-12, -15, 10)),
      createGlowingSphere(1, 0x8844ff, new THREE.Vector3(15, 5, -8)),
    ];

    // 处理窗口大小变化
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

    // 完全禁用所有鼠标交互
    const preventInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    renderer.domElement.addEventListener('click', preventInteraction, true);
    renderer.domElement.addEventListener('mousedown', preventInteraction, true);
    renderer.domElement.addEventListener('mouseup', preventInteraction, true);
    renderer.domElement.addEventListener('mousemove', preventInteraction, true);
    renderer.domElement.addEventListener('wheel', preventInteraction, true);
    renderer.domElement.addEventListener('touchstart', preventInteraction, true);
    renderer.domElement.addEventListener('touchmove', preventInteraction, true);
    renderer.domElement.addEventListener('touchend', preventInteraction, true);
    renderer.domElement.addEventListener('pointerdown', preventInteraction, true);
    renderer.domElement.addEventListener('pointermove', preventInteraction, true);
    renderer.domElement.addEventListener('pointerup', preventInteraction, true);

    // 动画循环 - 更流畅的动画
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 整体旋转粒子系统 - 更流畅的速度
      particleSystem.rotation.x = elapsedTime * 0.03;
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.z = elapsedTime * 0.02;

      // 为发光球添加更自然的动画
      spheres.forEach((sphere, i) => {
        // 脉动动画
        const pulseScale = Math.sin(elapsedTime * 0.4 + i * 1.2) * 0.25 + 1.3;
        sphere.scale.set(pulseScale, pulseScale, pulseScale);

        // 光环也跟随脉动
        if (sphere.userData.halo) {
          sphere.userData.halo.scale.copy(sphere.scale);
          sphere.userData.halo.position.copy(sphere.position);
        }

        // 轻微的轨道运动
        const orbitAngle = elapsedTime * 0.2 + i * ((Math.PI * 2) / spheres.length);
        const orbitRadius = 2 + i * 0.5;
        sphere.position.x += Math.cos(orbitAngle) * 0.003 * orbitRadius;
        sphere.position.y += Math.sin(orbitAngle) * 0.002 * orbitRadius;
      });

      // 光辉层的脉动
      glowLayers.forEach((layer, i) => {
        const layerPulse = Math.sin(elapsedTime * (0.2 - i * 0.05)) * 0.15 + 1;
        layer.scale.set(layerPulse, layerPulse, 1);

        // 轻微旋转
        layer.rotation.z = elapsedTime * (0.02 - i * 0.005);
      });

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

      // 移除所有事件监听器
      renderer.domElement.removeEventListener('click', preventInteraction, true);
      renderer.domElement.removeEventListener('mousedown', preventInteraction, true);
      renderer.domElement.removeEventListener('mouseup', preventInteraction, true);
      renderer.domElement.removeEventListener('mousemove', preventInteraction, true);
      renderer.domElement.removeEventListener('wheel', preventInteraction, true);
      renderer.domElement.removeEventListener('touchstart', preventInteraction, true);
      renderer.domElement.removeEventListener('touchmove', preventInteraction, true);
      renderer.domElement.removeEventListener('touchend', preventInteraction, true);
      renderer.domElement.removeEventListener('pointerdown', preventInteraction, true);
      renderer.domElement.removeEventListener('pointermove', preventInteraction, true);
      renderer.domElement.removeEventListener('pointerup', preventInteraction, true);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 释放资源
      particles.dispose();
      particleMaterial.dispose();
      if (particleTexture) particleTexture.dispose();

      glowLayers.forEach((layer) => {
        layer.geometry.dispose();
        (layer.material as THREE.Material).dispose();
      });

      spheres.forEach((sphere) => {
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
        if (sphere.userData.halo) {
          sphere.userData.halo.geometry.dispose();
          (sphere.userData.halo.material as THREE.Material).dispose();
        }
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
        touchAction: 'none',
        userSelect: 'none',
      }}
    />
  );
}

// HSL 转 RGB 辅助函数
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255) / 255,
    g: Math.round(g * 255) / 255,
    b: Math.round(b * 255) / 255,
  };
}
