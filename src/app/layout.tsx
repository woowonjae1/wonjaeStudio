import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
// 不要在服务器组件中直接导入客户端组件
// import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Woowonjae Blog",
  description: "探索音乐制作的无限可能",
  icons: {
    icon: [
      { url: '/mancity.png', sizes: '32x32' },
      { url: '/mancity.ico', sizes: '16x16' }
    ],
    apple: '/mancity-apple.png',
    shortcut: '/mancity-shortcut.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          {/* 移除直接引用Navbar */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}