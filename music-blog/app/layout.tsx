import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AppHeader } from "@/components/AppHeader";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Woowonjae Music Blog",
  description: "音乐、编程、足球和生活的分享空间",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative`}>
        <div className="relative min-h-screen w-full overflow-hidden">
          {/* 整个页面的背景点阵 */}
          <DotPattern
            className="fixed inset-0 z-0 opacity-50 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          />
          <div className="relative z-10">
            <AppHeader />
            <main className="pt-20 container mx-auto px-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
