import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { getSiteConfig } from "@/lib/content";

const inter = Inter({ subsets: ["latin"] });

// 获取站点配置
const siteConfig = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://woowonjae.top"
  ),
  title: {
    default: siteConfig.site.title,
    template: `%s | ${siteConfig.site.title}`,
  },
  description: siteConfig.site.description,
  keywords: [
    "音乐笔记",
    "音乐学习",
    "乐理",
    "听感",
    "音乐制作",
    "WOOWONJAE",
    "音乐博客",
  ],
  authors: [{ name: siteConfig.site.author }],
  creator: siteConfig.site.author,
  publisher: siteConfig.site.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.site.url,
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    siteName: siteConfig.site.title,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    creator: "@woowonjae",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: siteConfig.site.title,
              description: siteConfig.site.description,
              url: siteConfig.site.url,
              author: {
                "@type": "Person",
                name: siteConfig.site.author,
                email: siteConfig.site.email,
              },
              inLanguage: "zh-CN",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
