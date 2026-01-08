import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  topics: string[];
  content: string;
  musicEmbed?: string;
  readingTime: number;
  pinned?: boolean;
  draft?: boolean;
}

export interface Topic {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

const postsDirectory = path.join(process.cwd(), "content/posts");
const configDirectory = path.join(process.cwd(), "content/config");

// 计算阅读时间（基于平均阅读速度 200 字/分钟）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// 获取所有文章
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
        tags: data.tags || [],
        topics: data.topics || [],
        content,
        musicEmbed: data.musicEmbed,
        readingTime: calculateReadingTime(content),
        pinned: data.pinned || false,
        draft: data.draft || false,
      } as Post;
    })
    .filter((post) => !post.draft) // 过滤草稿
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // 按日期降序排列

  return allPostsData;
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      summary: data.summary || "",
      tags: data.tags || [],
      topics: data.topics || [],
      content,
      musicEmbed: data.musicEmbed,
      readingTime: calculateReadingTime(content),
      pinned: data.pinned || false,
      draft: data.draft || false,
    } as Post;
  } catch (error) {
    return null;
  }
}

// 获取分页文章
export function getPaginatedPosts(
  page: number = 1,
  postsPerPage: number = 10
): PaginatedPosts {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage: page,
    totalPages,
    totalPosts,
  };
}

// 根据主题获取文章
export function getPostsByTopic(topicSlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.topics.some((topic) => topic.toLowerCase() === topicSlug.toLowerCase())
  );
}

// 获取所有主题及其文章数量
export function getAllTopics(): Topic[] {
  try {
    const topicsConfigPath = path.join(configDirectory, "topics.json");
    const topicsConfig = JSON.parse(fs.readFileSync(topicsConfigPath, "utf8"));
    const allPosts = getAllPosts();

    return topicsConfig.topics.map(
      (topic: { slug: string; name: string; description?: string }) => ({
        ...topic,
        count: allPosts.filter((post) =>
          post.topics.some(
            (postTopic) => postTopic.toLowerCase() === topic.slug.toLowerCase()
          )
        ).length,
      })
    );
  } catch (error) {
    return [];
  }
}

// 搜索文章
export function searchPosts(query: string): Post[] {
  const allPosts = getAllPosts();
  const searchTerm = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.summary.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}

// 获取置顶文章
export function getPinnedPost(): Post | null {
  try {
    const siteConfigPath = path.join(configDirectory, "site.json");
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, "utf8"));
    const pinnedSlug = siteConfig.blog.pinnedPost;

    if (pinnedSlug) {
      return getPostBySlug(pinnedSlug);
    }

    // 如果没有配置置顶文章，返回第一篇置顶标记的文章
    const allPosts = getAllPosts();
    return allPosts.find((post) => post.pinned) || null;
  } catch (error) {
    return null;
  }
}

// 获取站点配置
export function getSiteConfig() {
  try {
    const siteConfigPath = path.join(configDirectory, "site.json");
    return JSON.parse(fs.readFileSync(siteConfigPath, "utf8"));
  } catch (error) {
    return {
      site: {
        title: "WOOWONJAE",
        description: "音乐学习与聆听笔记",
        author: "Woowonjae",
        email: "contact@woowonjae.top",
        url: "https://woowonjae.top",
      },
      blog: {
        postsPerPage: 10,
        pinnedPost: "start-here",
      },
    };
  }
}

// 获取相邻文章（上一篇/下一篇）
export function getAdjacentPosts(currentSlug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

// 获取最新文章（用于首页）
export function getLatestPosts(limit: number = 12): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// 根据标签获取文章
export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
  );
}

// 获取所有标签及其文章数量
export function getAllTags(): { name: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagCounts: { [key: string]: number } = {};

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 验证文章数据完整性
export function validatePost(post: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const title = post.title as string | undefined;
  const date = post.date as string | undefined;
  const summary = post.summary as string | undefined;

  if (!title || title.trim().length === 0) {
    errors.push("标题不能为空");
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push("日期格式无效，应为 YYYY-MM-DD");
  }

  if (!summary || summary.trim().length === 0) {
    errors.push("摘要不能为空");
  }

  if (post.tags && !Array.isArray(post.tags)) {
    errors.push("标签应为数组格式");
  }

  if (post.topics && !Array.isArray(post.topics)) {
    errors.push("主题应为数组格式");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
