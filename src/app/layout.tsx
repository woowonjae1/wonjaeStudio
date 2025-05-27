import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}