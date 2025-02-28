import React from "react";
import Link from "next/link";
import { FaInstagram, FaWeibo } from 'react-icons/fa';
import { SiNeteasecloudmusic, SiBilibili } from 'react-icons/si';

const Header: React.FC = () => {
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://bilibili.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiBilibili className="w-5 h-5" />
              </a>
              <a href="https://music.163.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <SiNeteasecloudmusic className="w-5 h-5" />
              </a>
              <a href="https://weibo.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaWeibo className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;