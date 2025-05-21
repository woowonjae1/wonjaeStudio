'use client'

import React, { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaWeibo } from 'react-icons/fa';
import { SiNeteasecloudmusic, SiBilibili, SiXiaohongshu, SiGithub } from 'react-icons/si';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);

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

  const socialLinks = [
    { href: 'https://www.xiaohongshu.com/user/profile/5dd412400000000001006f7c', icon: SiXiaohongshu, label: '小红书', followers: 80 },
    { href: 'https://space.bilibili.com/270089039', icon: SiBilibili, label: 'Bilibili', followers: 3 },
    { href: 'https://github.com/woowonjae1', icon: SiGithub, label: 'GitHub', followers: 1 },
    { href: 'https://music.163.com/#/user/home?id=1939616311', icon: SiNeteasecloudmusic, label: '网易云', followers: 495 },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* 左侧 Logo 和头像 */}
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 rounded-full overflow-hidden cursor-pointer" onClick={() => setShowQRCode(true)}>
                <img
                  src="/image/头像.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link href="/" className="text-xl font-bold">
                Woowonjae&ningning
              </Link>
            </div>

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
                {socialLinks.map(({ href, icon: Icon, label, followers }) => (
                  <div key={label} className="relative group">
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 z-50 hidden group-hover:flex flex-col items-center">
                      <div className="bg-black/80 text-white text-xs rounded-lg px-3 py-1 shadow-lg backdrop-blur-sm min-w-[70px] text-center">
                        {label} {followers} Subscribers
                      </div>
                    </div>
                  </div>
                ))}
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

      {/* 微信二维码弹窗 */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setShowQRCode(false)}>
          <div className="bg-white p-5 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src="/image/微信二维码.jpg"
              alt="WeChat QR Code"
              style={{ width: "280px", height: "auto" }}
              className="mx-auto"
            />
            <div className="mt-3 text-center text-gray-600">微信扫一扫，联系我</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;