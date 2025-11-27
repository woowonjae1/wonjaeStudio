"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaInstagram, FaWeibo } from "react-icons/fa";
import {
  SiNeteasecloudmusic,
  SiBilibili,
  SiXiaohongshu,
  SiGithub,
} from "react-icons/si";
import { useAuth } from "@/hooks/useAuth";
import { LoginDialogMinimal } from "@/components/auth/LoginDialogMinimal";
import { RegisterDialogMinimal } from "@/components/auth/RegisterDialogMinimal";

const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const socialLinks = [
    {
      href: "https://www.xiaohongshu.com/user/profile/5dd412400000000001006f7c",
      icon: SiXiaohongshu,
      label: "小红书",
      followers: 80,
    },
    {
      href: "https://space.bilibili.com/270089039",
      icon: SiBilibili,
      label: "Bilibili",
      followers: 3,
    },
    {
      href: "https://github.com/woowonjae1",
      icon: SiGithub,
      label: "GitHub",
      followers: 1,
    },
    {
      href: "https://music.163.com/#/user/home?id=1939616311",
      icon: SiNeteasecloudmusic,
      label: "网易云",
      followers: 495,
    },
  ];

  // Get avatar color (neutral/dark theme compatible)
  const getAvatarColor = (email: string) => {
    const colors = [
      "bg-neutral-700",
      "bg-neutral-600",
      "bg-stone-700",
      "bg-zinc-700",
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 glass z-50 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo & Avatar */}
            <div className="flex items-center">
              <div
                className="w-8 h-8 mr-3 rounded-full overflow-hidden cursor-pointer border border-[var(--border-subtle)]"
                onClick={() => setShowQRCode(true)}
              >
                <img
                  src="/image/headPhoto.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-[var(--text-base)]"
              >
                Woowonjae&ningning
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => scrollToSection("albums")}
                  className="text-[var(--text-subdued)] hover:text-[var(--text-base)] text-sm font-medium transition-colors"
                >
                  Albums
                </button>
                <button
                  onClick={() => scrollToSection("manchester-city")}
                  className="text-[var(--text-subdued)] hover:text-[var(--text-base)] text-sm font-medium transition-colors"
                >
                  Manchester City
                </button>
                <button
                  onClick={() => scrollToSection("code")}
                  className="text-[var(--text-subdued)] hover:text-[var(--text-base)] text-sm font-medium transition-colors"
                >
                  Code
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-[var(--text-subdued)] hover:text-[var(--text-base)] text-sm font-medium transition-colors"
                >
                  About
                </button>
              </nav>

              {/* Social Icons */}
              <div className="hidden lg:flex items-center space-x-4 border-l border-[var(--border-subtle)] pl-6">
                {socialLinks.map(({ href, icon: Icon, label, followers }) => (
                  <div key={label} className="relative group">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 z-50 hidden group-hover:flex flex-col items-center">
                      <div className="bg-[var(--bg-elevated-highlight)] text-[var(--text-base)] text-xs rounded-md px-3 py-1 shadow-lg border border-[var(--border-subtle)] whitespace-nowrap">
                        {label} • {followers} Subs
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Auth / User */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-3 py-1.5 hover:bg-[var(--bg-elevated-highlight)] rounded-full transition-all duration-200 group border border-transparent hover:border-[var(--border-subtle)]"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${getAvatarColor(user.email || "")} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-[var(--text-base)]">
                      {user.email?.split("@")[0]}
                    </span>
                  </Link>
                ) : (
                  <>
                    <LoginDialogMinimal />
                    <RegisterDialogMinimal />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQRCode && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowQRCode(false)}
        >
          <div
            className="bg-[var(--bg-elevated)] p-6 rounded-xl shadow-2xl border border-[var(--border-subtle)] max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowQRCode(false)}
                className="text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white p-2 rounded-lg mb-4">
              <img
                src="/image/微信二维码.jpg"
                alt="WeChat QR Code"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="text-center text-[var(--text-subdued)] font-medium">
              Scan to connect on WeChat
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
