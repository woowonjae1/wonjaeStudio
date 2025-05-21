'use client'

import React from "react";
import Link from "next/link";
import { FaInstagram, FaWeibo } from 'react-icons/fa';
import { SiNeteasecloudmusic, SiBilibili, SiXiaohongshu, SiGithub } from 'react-icons/si';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // 头部导航栏的高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 左侧 Logo */}
          <Link href="/" className="text-xl font-bold">
            Woowonjae&ningning
          </Link>

          <div className="flex items-center space-x-12">
            {/* 右侧导航菜单 */}
            <nav className="flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('albums')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Albums
              </button>
              <button 
                onClick={() => scrollToSection('manchester-city')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Manchester City
              </button>
              <button 
                onClick={() => scrollToSection('code')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Code
              </button>
              <button 
                onClick={() => scrollToSection('game')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Game
              </button>
              <button 
                onClick={() => scrollToSection('music')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Music
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </button>
            </nav>

            {/* 社交媒体图标 */}
            <div className="flex items-center space-x-4">
              <a href="https://www.xiaohongshu.com/user/profile/5dd412400000000001006f7c" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiXiaohongshu className="w-5 h-5" />
              </a>
              <a href="https://space.bilibili.com/270089039" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiBilibili className="w-5 h-5" />
              </a>
              <a href="https://github.com/woowonjae1" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiGithub className="w-5 h-5" />
              </a>
              <a href="https://music.163.com/#/user/home?id=1939616311" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiNeteasecloudmusic className="w-5 h-5" />
              </a>
            </div>

            {isAuthenticated ? (
              <>
                <li>
                  <span className="text-gray-700">
                    欢迎, {user?.username}
                  </span>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-700 hover:text-[#98C5E9]">
                    个人资料
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-gray-700 hover:text-[#98C5E9]"
                  >
                    注销
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="text-gray-700 hover:text-[#98C5E9]">
                  登录
                </Link>
              </li>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;