'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/utils/api';

interface UserData {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 获取用户数据
    const fetchUserData = async () => {
      try {
        const data = await apiRequest<UserData>('/user/profile', { requireAuth: true });
        setUserData(data);
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // 等待重定向
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">个人资料</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">用户名</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            
            <div>
              <p className="text-gray-500">邮箱</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-gray-500">角色</p>
              <div className="flex flex-wrap gap-2">
                {user?.roles.map(role => (
                  <span key={role} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 