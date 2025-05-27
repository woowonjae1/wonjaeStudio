"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

// 简化版 DotPattern 组件，内联到这个文件中
function DotPattern({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    let animationFrameId: number;
    let dots: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    // 初始化点
    const initDots = () => {
      dots = [];
      const size = 20;
      const numDots = Math.floor((canvas.width * canvas.height) / (size * size * 100));
      for (let i = 0; i < numDots; i++) {
        dots.push({
          x: Math.random() * canvas.width / dpr,
          y: Math.random() * canvas.height / dpr,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    initDots();

    // 绘制函数
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // 边界检查
        if (dot.x < 0 || dot.x > canvas.width / dpr) {
          dot.vx = -dot.vx;
        }
        if (dot.y < 0 || dot.y > canvas.height / dpr) {
          dot.vy = -dot.vy;
        }

        let alpha = 1;
        // 中心点渐变效果
        const centerX = canvas.width / dpr / 2;
        const centerY = canvas.height / dpr / 2;
        const distX = Math.abs(dot.x - centerX) / (canvas.width / dpr / 2);
        const distY = Math.abs(dot.y - centerY) / (canvas.height / dpr / 2);
        const dist = Math.max(distX, distY);
        alpha = 1 - Math.min(dist, 1);

        ctx.fillStyle = `rgba(143, 143, 143, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // 启动动画
    draw();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

// 简化版 FloatingCard 组件，内联到这个文件中
function FloatingCard({ 
  children, 
  className, 
  floatIntensity = 10 
}: { 
  children: React.ReactNode; 
  className?: string; 
  floatIntensity?: number; 
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 自动浮动动画
  useEffect(() => {
    if (!cardRef.current) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      const newX = Math.sin(time) * (floatIntensity * 0.2);
      const newY = Math.cos(time * 0.8) * (floatIntensity * 0.1);

      // 如果鼠标没有悬停，则应用浮动效果
      if (!isHovered) {
        setRotation({ x: newY * 0.5, y: newX * 0.5 });
        setPosition({ x: newX, y: newY });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [floatIntensity, isHovered]);

  // 鼠标悬停效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setRotation({ x: -y * 10, y: x * 10 });
    setPosition({ x: x * 5, y: y * 5 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(${position.x}px) translateY(${position.y}px)`,
        transition: isHovered ? "none" : "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTimeout(() => {
          setRotation({ x: 0, y: 0 });
          setPosition({ x: 0, y: 0 });
        }, 100);
      }}
    >
      {children}
    </div>
  );
}

// 自定义 DotPatternDemo 组件
function DotPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <DotPattern
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
      <div className="relative z-10 text-center">
        <h3 className="text-2xl font-bold mb-2">漂浮效果背景</h3>
        <p>带有视觉动态效果的点阵背景</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-[#1C2C5B] font-semibold tracking-wide uppercase">欢迎来到</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Woowonjae 音乐博客
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            音乐、编程、足球和生活的分享空间
          </p>
        </div>

        <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="text-center">
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-lg">
                  欢迎回来, <span className="font-bold">{user?.nickname || user?.username}</span>!
                </p>
                <div className="flex justify-center gap-4">
                  <Link 
                    href="/dashboard" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C2C5B] hover:bg-[#98C5E9]"
                  >
                    前往个人中心
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.reload();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">请登录以获取完整功能</p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C2C5B] hover:bg-[#98C5E9]"
                >
                  登录 / 注册
                </Link>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900">使用说明</h3>
            <ul className="mt-4 space-y-2 text-gray-500 list-disc list-inside">
              <li>请先在Supabase创建你的项目，并配置环境变量</li>
              <li>设置 <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 文件</li>
              <li>创建 <code className="bg-gray-100 px-1 py-0.5 rounded">profiles</code> 表和 <code className="bg-gray-100 px-1 py-0.5 rounded">avatars</code> 存储桶</li>
              <li>测试登录、注册和头像上传功能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
