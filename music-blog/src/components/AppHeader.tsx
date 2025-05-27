"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
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
        </div>
      </div>
    </header>
  );
} 