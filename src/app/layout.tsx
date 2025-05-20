import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from '@/components/layout/Header';

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
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}