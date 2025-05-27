'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Image from 'next/image';

export function AppHeader() {
  const router = useRouter();
  const { user, isAuthenticated, logout, clearSession } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    await clearSession();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 左侧 Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center">
              <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                <img
                  src="/image/headPhoto.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Woowonjae&ningning</span>
            </Link>
          </div>

          {/* 右侧导航 */}
          <div className="flex items-center space-x-6">
            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/#albums" className="text-gray-600 hover:text-gray-900 transition-colors">
                Albums
              </Link>
              <Link href="/#manchester-city" className="text-gray-600 hover:text-gray-900 transition-colors">
                Manchester City
              </Link>
              <Link href="/#code" className="text-gray-600 hover:text-gray-900 transition-colors">
                Code
              </Link>
              <Link href="/#game" className="text-gray-600 hover:text-gray-900 transition-colors">
                Game
              </Link>
              <Link href="/#music" className="text-gray-600 hover:text-gray-900 transition-colors">
                Music
              </Link>
              <Link href="/#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </nav>

            {/* 用户登录区域 */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div className="relative">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.username || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1C2C5B] flex items-center justify-center text-white text-lg font-semibold">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <span className="hidden md:inline font-medium text-gray-800">
                      {user.nickname || user.username || "用户"}
                    </span>
                  </div>
                  
                  {/* 用户下拉菜单 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                      <div className="py-1">
                        <Link 
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          个人资料
                        </Link>
                        <Link 
                          href="/dashboard/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          设置
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    className="bg-[#1C2C5B] hover:bg-[#98C5E9] text-white px-4 py-2 rounded-md transition-colors shadow-md"
                    onClick={() => router.push('/login')}
                  >
                    登录 / 注册
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 