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
      { url: '/image/manchester_city_logo.jpg', sizes: '32x32', type: 'image/jpeg' },
    ],
    apple: '/image/manchester_city_logo.jpg',
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