import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "音乐制作中心",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}