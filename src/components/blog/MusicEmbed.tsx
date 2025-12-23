import React from "react";

interface MusicEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

// 检测音乐平台类型
function detectMusicPlatform(
  url: string
): "spotify" | "youtube" | "netease" | "unknown" {
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("music.163.com")) return "netease";
  return "unknown";
}

// 转换 URL 为嵌入格式
function convertToEmbedUrl(url: string, platform: string): string {
  switch (platform) {
    case "spotify":
      // 将 Spotify 链接转换为嵌入格式
      if (url.includes("/embed/")) return url;

      const spotifyMatch = url.match(
        /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
      );
      if (spotifyMatch) {
        const [, type, id] = spotifyMatch;
        return `https://open.spotify.com/embed/${type}/${id}`;
      }
      return url;

    case "youtube":
      // 将 YouTube 链接转换为嵌入格式
      if (url.includes("/embed/")) return url;

      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v") || "";
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;

    case "netease":
      // 网易云音乐嵌入处理
      if (url.includes("music.163.com")) {
        const songMatch = url.match(/song\?id=(\d+)/);
        if (songMatch) {
          return `https://music.163.com/outchain/player?type=2&id=${songMatch[1]}&auto=0&height=66`;
        }
      }
      return url;

    default:
      return url;
  }
}

export function MusicEmbed({ url, title, className = "" }: MusicEmbedProps) {
  const platform = detectMusicPlatform(url);
  const embedUrl = convertToEmbedUrl(url, platform);

  // 平台特定的样式和配置
  const platformConfig = {
    spotify: {
      height: "352",
      allowTransparency: true,
      allow:
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
      loading: "lazy" as const,
    },
    youtube: {
      height: "315",
      allowTransparency: false,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      loading: "lazy" as const,
    },
    netease: {
      height: "86",
      allowTransparency: false,
      allow: "autoplay",
      loading: "lazy" as const,
    },
    unknown: {
      height: "200",
      allowTransparency: false,
      allow: "",
      loading: "lazy" as const,
    },
  };

  const config = platformConfig[platform];

  // 如果是未知平台，显示外部链接
  if (platform === "unknown") {
    return (
      <div
        className={`music-embed-fallback p-6 border border-border rounded-lg text-center ${className}`}
      >
        <div className="w-12 h-12 mx-auto mb-3 text-muted-foreground">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <h3 className="font-medium mb-2">{title || "音乐内容"}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          点击下方链接在外部平台播放
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          在外部平台播放
        </a>
      </div>
    );
  }

  return (
    <div className={`music-embed ${className}`}>
      {title && (
        <h3 className="text-lg font-medium mb-3 text-center">{title}</h3>
      )}
      <div className="relative w-full rounded-lg overflow-hidden bg-secondary/10">
        <iframe
          src={embedUrl}
          width="100%"
          height={config.height}
          frameBorder="0"
          allowTransparency={config.allowTransparency}
          allow={config.allow}
          loading={config.loading}
          title={title || `${platform} 音乐播放器`}
          className="w-full"
        />
      </div>

      {/* 平台标识 */}
      <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
        <span className="capitalize">{platform}</span>
        <span className="mx-1">•</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          在原平台打开
        </a>
      </div>
    </div>
  );
}

// 简化的音乐链接组件（用于文章卡片等地方）
interface MusicLinkProps {
  url: string;
  className?: string;
}

export function MusicLink({ url, className = "" }: MusicLinkProps) {
  const platform = detectMusicPlatform(url);

  const platformIcons = {
    spotify: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    netease: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-1.087 1.087-2.568 1.687-4.168 1.687s-3.081-.6-4.168-1.687c-1.087-1.087-1.687-2.568-1.687-4.168s.6-3.081 1.687-4.168c1.087-1.087 2.568-1.687 4.168-1.687s3.081.6 4.168 1.687c1.087 1.087 1.687 2.568 1.687 4.168s-.6 3.081-1.687 4.168z" />
      </svg>
    ),
    unknown: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
  };

  const platformNames = {
    spotify: "Spotify",
    youtube: "YouTube",
    netease: "网易云音乐",
    unknown: "音乐链接",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title={`在 ${platformNames[platform]} 中打开`}
    >
      {platformIcons[platform]}
      <span>{platformNames[platform]}</span>
    </a>
  );
}

export default MusicEmbed;
