'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FloatingCard } from '@/components/ui/floating-card';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 检查是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      // 给一个短暂延迟，让 auth 状态加载完成
      setTimeout(() => {
        if (!isAuthenticated) {
          router.push('/');
        } else {
          setLoading(false);
        }
      }, 500);
    };

    checkAuth();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <DotPattern 
        className="fixed inset-0 z-[-1] opacity-50 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        size={15}
      />

      <div className="max-w-4xl mx-auto px-4">
        <FloatingCard className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username || "User profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1C2C5B] flex items-center justify-center text-white text-4xl font-semibold">
                  {user?.nickname?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.nickname || user?.username || "用户"}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user?.role || "用户"}
                </span>
              </div>
            </div>
          </div>
        </FloatingCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingCard floatIntensity={5} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">个人信息</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">用户名：</span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">昵称：</span>
                <span className="font-medium">{user?.nickname || "未设置"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">邮箱：</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">角色：</span>
                <span className="font-medium">{user?.role || "用户"}</span>
              </div>
            </div>
            
            <button
              className="mt-6 w-full py-2 bg-[#1C2C5B] hover:bg-[#98C5E9] text-white rounded-md transition-colors"
            >
              编辑资料
            </button>
          </FloatingCard>

          <FloatingCard floatIntensity={7} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">活动记录</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium">登录成功</p>
                  <p className="text-sm text-gray-500">最近登录时间: {new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium">完善个人资料</p>
                  <p className="text-sm text-gray-500">上传了头像</p>
                </div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
} 