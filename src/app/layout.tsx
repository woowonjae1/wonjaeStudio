import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import GlobalMusicPlayer from "@/components/GlobalMusicPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "WOOWONJAE MUSIC - Original Beats & Productions",
  description:
    "Experience the sound of tomorrow. Original beats, R&B, and emotional soundscapes by WOOWONJAE. Listen to Crush, Romantic, Nobody Gets Me, and more.",
  keywords: [
    "WOOWONJAE",
    "music producer",
    "beats",
    "R&B",
    "hip hop",
    "instrumental",
    "music",
  ],
  authors: [{ name: "WOOWONJAE" }],
  creator: "WOOWONJAE",
  publisher: "WOOWONJAE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://woowonjae.com",
    title: "WOOWONJAE MUSIC - Original Beats & Productions",
    description:
      "Experience the sound of tomorrow. Original beats, R&B, and emotional soundscapes.",
    siteName: "WOOWONJAE MUSIC",
    images: [
      {
        url: "/image/Romantic.jpg",
        width: 1200,
        height: 630,
        alt: "WOOWONJAE Music",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WOOWONJAE MUSIC - Original Beats & Productions",
    description:
      "Experience the sound of tomorrow. Original beats, R&B, and emotional soundscapes.",
    images: ["/image/Romantic.jpg"],
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "WOOWONJAE",
              genre: ["R&B", "Hip Hop", "Electronic"],
              url: "https://woowonjae.com",
              email: "woowonjae0827@outlook.com",
              description:
                "Music producer creating original beats and emotional soundscapes",
              album: [
                {
                  "@type": "MusicAlbum",
                  name: "Crush",
                  image: "/image/HeartBreaking.jpg",
                },
                {
                  "@type": "MusicAlbum",
                  name: "傍晚的 Romantic",
                  image: "/image/Romantic.jpg",
                },
                {
                  "@type": "MusicAlbum",
                  name: "Nobody Gets Me",
                  image: "/image/nobodygetsme.jpg",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <MusicPlayerProvider>
          {children}
          <GlobalMusicPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
