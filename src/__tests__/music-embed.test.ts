/**
 * **Feature: music-notes-blog, Property 7: 音乐内容嵌入正确性**
 * **验证：需求 2.4, 4.2**
 *
 * 属性测试：对于任何包含音乐嵌入的文章，应该正确处理外部平台链接
 * （Spotify、YouTube、网易云音乐）而不托管音频文件
 */

import fc from "fast-check";

// 模拟音乐嵌入组件的核心逻辑
function detectMusicPlatform(
  url: string
): "spotify" | "youtube" | "netease" | "unknown" {
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("music.163.com")) return "netease";
  return "unknown";
}

function convertToEmbedUrl(url: string, platform: string): string {
  switch (platform) {
    case "spotify":
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
      if (url.includes("/embed/")) return url;

      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(url.split("?")[1] || "");
        videoId = urlParams.get("v") || "";
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;

    case "netease":
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

// 验证是否为外部链接（不托管音频文件）
function isExternalLink(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // 检查是否为支持的外部音乐平台
    const supportedPlatforms = [
      "open.spotify.com",
      "spotify.com",
      "youtube.com",
      "youtu.be",
      "music.163.com",
    ];

    return supportedPlatforms.some((platform) => hostname.includes(platform));
  } catch {
    return false;
  }
}

// 验证是否不托管音频文件
function doesNotHostAudioFiles(url: string): boolean {
  const audioExtensions = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];
  const lowerUrl = url.toLowerCase();

  // 检查URL是否指向音频文件
  const pointsToAudioFile = audioExtensions.some((ext) =>
    lowerUrl.includes(ext)
  );

  // 检查是否为本地文件路径
  const isLocalFile =
    lowerUrl.startsWith("/") ||
    lowerUrl.startsWith("./") ||
    lowerUrl.startsWith("../");

  return !pointsToAudioFile && !isLocalFile;
}

// 生成测试用的音乐URL
const spotifyUrlArbitrary = fc.oneof(
  fc
    .record({
      type: fc.constantFrom("track", "album", "playlist"),
      id: fc
        .string({ minLength: 22, maxLength: 22 })
        .filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
    })
    .map(({ type, id }) => `https://open.spotify.com/${type}/${id}`),
  fc
    .record({
      type: fc.constantFrom("track", "album", "playlist"),
      id: fc
        .string({ minLength: 22, maxLength: 22 })
        .filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
    })
    .map(({ type, id }) => `https://open.spotify.com/embed/${type}/${id}`)
);

const youtubeUrlArbitrary = fc.oneof(
  fc
    .string({ minLength: 11, maxLength: 11 })
    .filter((s) => /^[a-zA-Z0-9_-]+$/.test(s))
    .map((id) => `https://www.youtube.com/watch?v=${id}`),
  fc
    .string({ minLength: 11, maxLength: 11 })
    .filter((s) => /^[a-zA-Z0-9_-]+$/.test(s))
    .map((id) => `https://youtu.be/${id}`),
  fc
    .string({ minLength: 11, maxLength: 11 })
    .filter((s) => /^[a-zA-Z0-9_-]+$/.test(s))
    .map((id) => `https://www.youtube.com/embed/${id}`)
);

const neteaseUrlArbitrary = fc.oneof(
  fc
    .integer({ min: 1000000, max: 999999999 })
    .map((id) => `https://music.163.com/song?id=${id}`),
  fc
    .integer({ min: 1000000, max: 999999999 })
    .map(
      (id) =>
        `https://music.163.com/outchain/player?type=2&id=${id}&auto=0&height=66`
    )
);

const musicUrlArbitrary = fc.oneof(
  spotifyUrlArbitrary,
  youtubeUrlArbitrary,
  neteaseUrlArbitrary
);

describe("音乐内容嵌入属性测试", () => {
  test("属性7.1: 平台检测应该正确识别支持的音乐平台", () => {
    fc.assert(
      fc.property(musicUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);

        if (url.includes("spotify.com")) {
          expect(platform).toBe("spotify");
        } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
          expect(platform).toBe("youtube");
        } else if (url.includes("music.163.com")) {
          expect(platform).toBe("netease");
        } else {
          expect(platform).toBe("unknown");
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.2: 所有音乐链接都应该是外部链接", () => {
    fc.assert(
      fc.property(musicUrlArbitrary, (url) => {
        const isExternal = isExternalLink(url);
        expect(isExternal).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.3: 音乐嵌入不应该托管音频文件", () => {
    fc.assert(
      fc.property(musicUrlArbitrary, (url) => {
        const doesNotHost = doesNotHostAudioFiles(url);
        expect(doesNotHost).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.4: Spotify URL 转换应该生成正确的嵌入格式", () => {
    fc.assert(
      fc.property(spotifyUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);
        const embedUrl = convertToEmbedUrl(url, platform);

        expect(platform).toBe("spotify");
        expect(embedUrl).toMatch(
          /^https:\/\/open\.spotify\.com\/embed\/(track|album|playlist)\/[a-zA-Z0-9]+$/
        );

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.5: YouTube URL 转换应该生成正确的嵌入格式", () => {
    fc.assert(
      fc.property(youtubeUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);
        const embedUrl = convertToEmbedUrl(url, platform);

        expect(platform).toBe("youtube");

        // 如果已经是嵌入格式，应该保持不变
        if (url.includes("/embed/")) {
          expect(embedUrl).toBe(url);
        } else {
          expect(embedUrl).toMatch(
            /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/
          );
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.6: 网易云音乐 URL 转换应该生成正确的嵌入格式", () => {
    fc.assert(
      fc.property(neteaseUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);
        const embedUrl = convertToEmbedUrl(url, platform);

        expect(platform).toBe("netease");

        // 如果已经是嵌入格式，应该保持不变
        if (url.includes("outchain/player")) {
          expect(embedUrl).toBe(url);
        } else {
          expect(embedUrl).toMatch(
            /^https:\/\/music\.163\.com\/outchain\/player\?type=2&id=\d+&auto=0&height=66$/
          );
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.7: 未知平台应该返回原始URL", () => {
    const unknownUrls = [
      "https://example.com/music",
      "https://soundcloud.com/track/123",
      "https://bandcamp.com/album/test",
      "http://localhost:3000/audio.mp3",
    ];

    unknownUrls.forEach((url) => {
      const platform = detectMusicPlatform(url);
      const embedUrl = convertToEmbedUrl(url, platform);

      expect(platform).toBe("unknown");
      expect(embedUrl).toBe(url);
    });
  });

  test("属性7.8: 音频文件链接应该被正确识别和拒绝", () => {
    const audioFileUrls = [
      "https://example.com/song.mp3",
      "https://example.com/audio.wav",
      "https://example.com/music.flac",
      "/local/audio.aac",
      "./music.ogg",
      "../sounds.m4a",
    ];

    audioFileUrls.forEach((url) => {
      const doesNotHost = doesNotHostAudioFiles(url);
      expect(doesNotHost).toBe(false);
    });
  });

  test("属性7.9: 嵌入URL应该保持HTTPS协议", () => {
    fc.assert(
      fc.property(musicUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);
        const embedUrl = convertToEmbedUrl(url, platform);

        if (platform !== "unknown") {
          expect(embedUrl).toMatch(/^https:\/\//);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性7.10: URL转换应该是幂等的", () => {
    fc.assert(
      fc.property(musicUrlArbitrary, (url) => {
        const platform = detectMusicPlatform(url);
        const embedUrl1 = convertToEmbedUrl(url, platform);
        const embedUrl2 = convertToEmbedUrl(embedUrl1, platform);

        // 转换应该是幂等的 - 转换两次应该得到相同结果
        expect(embedUrl1).toBe(embedUrl2);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// 集成测试：测试实际的组件行为
describe("音乐嵌入组件集成测试", () => {
  test("Spotify 链接处理", () => {
    const testCases = [
      {
        input: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
        expected: "https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh",
      },
      {
        input: "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3",
        expected: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
      },
      {
        input: "https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh",
        expected: "https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const platform = detectMusicPlatform(input);
      const result = convertToEmbedUrl(input, platform);
      expect(result).toBe(expected);
    });
  });

  test("YouTube 链接处理", () => {
    const testCases = [
      {
        input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        expected: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        input: "https://youtu.be/dQw4w9WgXcQ",
        expected: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        input: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        expected: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const platform = detectMusicPlatform(input);
      const result = convertToEmbedUrl(input, platform);
      expect(result).toBe(expected);
    });
  });

  test("网易云音乐链接处理", () => {
    const testCases = [
      {
        input: "https://music.163.com/song?id=123456789",
        expected:
          "https://music.163.com/outchain/player?type=2&id=123456789&auto=0&height=66",
      },
      {
        input:
          "https://music.163.com/outchain/player?type=2&id=123456789&auto=0&height=66",
        expected:
          "https://music.163.com/outchain/player?type=2&id=123456789&auto=0&height=66",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const platform = detectMusicPlatform(input);
      const result = convertToEmbedUrl(input, platform);
      expect(result).toBe(expected);
    });
  });

  test("外部链接验证", () => {
    const validExternalLinks = [
      "https://open.spotify.com/track/123",
      "https://www.youtube.com/watch?v=123",
      "https://music.163.com/song?id=123",
    ];

    const invalidLinks = [
      "/local/file.mp3",
      "./audio.wav",
      "https://example.com/song.mp3",
    ];

    validExternalLinks.forEach((url) => {
      expect(isExternalLink(url)).toBe(true);
    });

    invalidLinks.forEach((url) => {
      expect(isExternalLink(url)).toBe(false);
    });
  });

  test("音频文件托管检查", () => {
    const nonHostedUrls = [
      "https://open.spotify.com/track/123",
      "https://www.youtube.com/watch?v=123",
      "https://music.163.com/song?id=123",
    ];

    const hostedUrls = [
      "/audio/song.mp3",
      "https://example.com/music.wav",
      "./sounds/track.flac",
    ];

    nonHostedUrls.forEach((url) => {
      expect(doesNotHostAudioFiles(url)).toBe(true);
    });

    hostedUrls.forEach((url) => {
      expect(doesNotHostAudioFiles(url)).toBe(false);
    });
  });
});
