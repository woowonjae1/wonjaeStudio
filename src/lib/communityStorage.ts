// 社区数据存储 - 支持 Supabase 和 localStorage 双模式

import {
  isSupabaseAvailable,
  getTopics as getSupabaseTopics,
  getTopic as getSupabaseTopic,
  createTopic as createSupabaseTopic,
  getReplies as getSupabaseReplies,
  createReply as createSupabaseReply,
  formatTime as supabaseFormatTime,
} from "./supabase";

// 检查 Supabase 是否配置
const isSupabaseConfigured = () => {
  return isSupabaseAvailable();
};

// 统一的类型定义
export interface Post {
  id: number;
  title: string;
  category: string;
  tags?: string[];
  author: string;
  content: string;
  replies: number;
  views: number;
  time: string;
  pinned?: boolean;
  createdAt: number;
  imageUrl?: string;
  musicUrl?: string;
  musicTitle?: string;
}

export interface Reply {
  id: number;
  postId: number;
  author: string;
  content: string;
  time: string;
  createdAt: number;
  parentId?: number | null; // 父回复ID，用于嵌套回复
  authorId?: string; // 作者ID
}

// ============ localStorage 实现 ============

const POSTS_KEY = "community_posts";
const REPLIES_KEY = "community_replies";
const VERSION_KEY = "community_data_version";
const CURRENT_VERSION = "1.5"; // 修复parentId存储问题

const defaultPosts: Post[] = [
  {
    id: 1,
    title: "如何用 Pro-Q3 处理人声齿音？",
    category: "mixing",
    author: "MixMaster",
    content: `最近混音遇到人声齿音问题，6-8kHz 频段很刺耳。

试过静态 EQ 削减 -3dB，效果不明显。用 De-esser 又感觉人声变闷了。

想问下 Pro-Q3 的动态 EQ 怎么设置比较好？`,
    replies: 2,
    views: 456,
    time: "1小时前",
    pinned: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 2,
    title: "分享我的人声压缩链路",
    category: "production",
    author: "BeatMaker",
    content: "分享一下我常用的人声压缩设置...",
    replies: 0,
    views: 892,
    time: "2小时前",
    createdAt: Date.now() - 7200000,
  },
  {
    id: 3,
    title: "VintageVerb vs Pro-R 哪个更适合流行？",
    category: "plugins",
    author: "SoundPro",
    content: "想问下大家对这两款混响的看法...",
    replies: 0,
    views: 567,
    time: "3小时前",
    createdAt: Date.now() - 10800000,
  },
];

const defaultReplies: Reply[] = [
  {
    id: 1,
    postId: 1,
    author: "AudioEng",
    content: `Pro-Q3 动态 EQ 很适合处理齿音。

设置建议：
- 频率：5-8kHz（用频谱找最明显的点）
- Q 值：2-4
- 增益：-6 到 -10dB
- 开启动态模式`,
    time: "45分钟前",
    createdAt: Date.now() - 2700000,
    authorId: "audioeng-001",
    parentId: null,
  },
  {
    id: 2,
    postId: 1,
    author: "BeatMaker",
    content: `也可以考虑用多段压缩，Pro-MB 效果也不错。`,
    time: "30分钟前",
    createdAt: Date.now() - 1800000,
    authorId: "beatmaker-001",
    parentId: null,
  },
  {
    id: 3,
    postId: 1,
    author: "MixMaster",
    content: `@AudioEng 谢谢建议！我试试动态 EQ，Q 值设置多少比较合适？`,
    time: "20分钟前",
    createdAt: Date.now() - 1200000,
    parentId: 1,
    authorId: "mixmaster-001",
  },
  {
    id: 4,
    postId: 1,
    author: "AudioEng",
    content: `@MixMaster 建议从 Q=3 开始，太窄会不自然，太宽会影响其他频率。`,
    time: "15分钟前",
    createdAt: Date.now() - 900000,
    parentId: 1,
    authorId: "audioeng-001",
  },
];

function getLocalPosts(): Post[] {
  if (typeof window === "undefined") return defaultPosts;

  const stored = localStorage.getItem(POSTS_KEY);
  if (!stored) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return defaultPosts;
  }
}

function getLocalPost(id: number): Post | undefined {
  return getLocalPosts().find((p) => p.id === id);
}

function addLocalPost(
  post: Omit<Post, "id" | "replies" | "views" | "createdAt">
): Post {
  const posts = getLocalPosts();
  const newPost: Post = {
    ...post,
    id: Date.now(),
    replies: 0,
    views: 0,
    createdAt: Date.now(),
  };

  posts.unshift(newPost);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return newPost;
}

function getLocalReplies(postId: number): Reply[] {
  if (typeof window === "undefined") {
    return defaultReplies.filter((r) => r.postId === postId);
  }

  // 检查数据版本，如果版本不匹配则重置数据
  const currentVersion = localStorage.getItem(VERSION_KEY);
  console.log("=== 版本检查 ===");
  console.log("当前版本:", currentVersion);
  console.log("期望版本:", CURRENT_VERSION);

  if (currentVersion !== CURRENT_VERSION) {
    console.log("版本不匹配，重置数据");
    console.log("默认回复数据:", defaultReplies);
    localStorage.setItem(POSTS_KEY, JSON.stringify(defaultPosts));
    localStorage.setItem(REPLIES_KEY, JSON.stringify(defaultReplies));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    const filteredReplies = defaultReplies.filter((r) => r.postId === postId);
    console.log("返回的过滤回复:", filteredReplies);
    return filteredReplies;
  }

  const stored = localStorage.getItem(REPLIES_KEY);
  if (!stored) {
    localStorage.setItem(REPLIES_KEY, JSON.stringify(defaultReplies));
    return defaultReplies.filter((r) => r.postId === postId);
  }

  try {
    const replies: Reply[] = JSON.parse(stored);
    console.log("=== 从localStorage读取的数据 ===");
    console.log("所有回复:", replies);
    console.log("检查parentId字段:");
    replies.forEach((reply, index) => {
      console.log(`回复${index}:`, {
        id: reply.id,
        parentId: reply.parentId,
        parentIdType: typeof reply.parentId,
        hasParentId: reply.parentId !== undefined && reply.parentId !== null,
      });
    });
    const filteredReplies = replies.filter((r) => r.postId === postId);
    console.log("过滤后的回复:", filteredReplies);
    return filteredReplies;
  } catch {
    // 如果解析失败，重置为默认数据
    console.log("localStorage解析失败，重置为默认数据");
    localStorage.setItem(REPLIES_KEY, JSON.stringify(defaultReplies));
    return defaultReplies.filter((r) => r.postId === postId);
  }
}

function addLocalReply(
  postId: number,
  author: string,
  content: string,
  authorId?: string,
  parentId?: number | null
): Reply {
  let replies: Reply[] = [];
  const stored = localStorage.getItem(REPLIES_KEY);
  if (stored) {
    try {
      replies = JSON.parse(stored);
    } catch {
      replies = [...defaultReplies];
    }
  } else {
    replies = [...defaultReplies];
  }

  // 确保 parentId 的正确处理
  const finalParentId =
    parentId !== undefined && parentId !== null && parentId > 0
      ? parentId
      : null;

  const newReply: Reply = {
    id: Date.now(),
    postId,
    author,
    content,
    time: "刚刚",
    createdAt: Date.now(),
    parentId: finalParentId,
    authorId,
  };

  console.log("=== addLocalReply ===");
  console.log("输入参数:", { postId, author, content, authorId, parentId });
  console.log("处理后的parentId:", finalParentId);
  console.log("创建新回复:", newReply);

  replies.push(newReply);
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies));

  // 更新帖子回复数
  const posts = getLocalPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex !== -1) {
    posts[postIndex].replies += 1;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  return newReply;
}

function incrementLocalViews(postId: number): void {
  const posts = getLocalPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex !== -1) {
    posts[postIndex].views += 1;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }
}

// ============ 统一导出接口 ============

export async function getPosts(
  category?: string,
  sortBy: "latest" | "popular" | "activity" = "latest"
): Promise<Post[]> {
  if (isSupabaseConfigured()) {
    try {
      const topics = await getSupabaseTopics(category);
      return topics.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        author: t.author_name,
        content: t.content,
        replies: t.replies_count || 0,
        views: t.views,
        time: supabaseFormatTime(t.created_at),
        pinned: t.pinned,
        createdAt: new Date(t.created_at).getTime(),
      }));
    } catch (error) {
      console.error("Supabase error, falling back to localStorage:", error);
    }
  }

  let posts = getLocalPosts();
  if (category && category !== "all") {
    posts = posts.filter((p) => p.category === category);
  }

  // Sort posts
  return sortPosts(posts, sortBy);
}

function sortPosts(
  posts: Post[],
  sortBy: "latest" | "popular" | "activity"
): Post[] {
  const sorted = [...posts];

  switch (sortBy) {
    case "popular":
      // Sort by views + replies (weighted)
      sorted.sort((a, b) => {
        const scoreA = a.views + a.replies * 2;
        const scoreB = b.views + b.replies * 2;
        return scoreB - scoreA;
      });
      break;
    case "activity":
      // Sort by most recent activity (replies or creation)
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "latest":
    default:
      // Sort by creation time
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }

  // Pinned posts always come first
  const pinned = sorted.filter((p) => p.pinned);
  const unpinned = sorted.filter((p) => !p.pinned);
  return [...pinned, ...unpinned];
}

export async function getPost(id: number): Promise<Post | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const topic = await getSupabaseTopic(id);
      if (topic) {
        return {
          id: topic.id,
          title: topic.title,
          category: topic.category,
          author: topic.author_name,
          content: topic.content,
          replies: 0,
          views: topic.views,
          time: supabaseFormatTime(topic.created_at),
          pinned: topic.pinned,
          createdAt: new Date(topic.created_at).getTime(),
        };
      }
    } catch (error) {
      console.error("Supabase error, falling back to localStorage:", error);
    }
  }

  return getLocalPost(id);
}

export async function addPost(post: {
  title: string;
  category: string;
  tags?: string[];
  author: string;
  content: string;
  time: string;
  authorId: string;
  imageUrl?: string;
  musicUrl?: string;
  musicTitle?: string;
}): Promise<Post> {
  if (isSupabaseConfigured()) {
    try {
      const topic = await createSupabaseTopic({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        author_name: post.author,
        author_id: post.authorId,
      });

      if (topic) {
        return {
          id: topic.id,
          title: topic.title,
          category: topic.category,
          tags: topic.tags || [],
          author: topic.author_name,
          content: topic.content,
          replies: 0,
          views: 0,
          time: "刚刚",
          pinned: false,
          createdAt: Date.now(),
        };
      }
    } catch (error) {
      console.error("Supabase error, falling back to localStorage:", error);
    }
  }

  return addLocalPost(post);
}

export async function getReplies(postId: number): Promise<Reply[]> {
  if (isSupabaseConfigured()) {
    try {
      const replies = await getSupabaseReplies(postId);
      return replies.map((r) => ({
        id: r.id,
        postId: r.topic_id,
        author: r.author_name,
        content: r.content,
        time: supabaseFormatTime(r.created_at),
        createdAt: new Date(r.created_at).getTime(),
        parentId: r.parent_id || null, // 使用 null 而不是 undefined
        authorId: r.author_id,
      }));
    } catch (error) {
      console.error("Supabase error, falling back to localStorage:", error);
    }
  }

  return getLocalReplies(postId);
}

export async function addReply(
  postId: number,
  author: string,
  content: string,
  authorId: string,
  parentId?: number | null
): Promise<Reply> {
  console.log("=== addReply 函数调用 ===");
  console.log("参数:", { postId, author, content, authorId, parentId });
  console.log("parentId类型:", typeof parentId);
  console.log("parentId是否为null:", parentId === null);
  console.log("parentId是否为undefined:", parentId === undefined);

  if (isSupabaseConfigured()) {
    try {
      const reply = await createSupabaseReply({
        topic_id: postId,
        content,
        author_name: author,
        author_id: authorId,
      });

      if (reply) {
        return {
          id: reply.id,
          postId: reply.topic_id,
          author: reply.author_name,
          content: reply.content,
          time: "刚刚",
          createdAt: Date.now(),
          parentId: parentId || null,
          authorId,
        };
      }
    } catch (error) {
      console.error("Supabase error, falling back to localStorage:", error);
    }
  }

  console.log("=== 调用 addLocalReply ===");
  console.log("传递的参数:", { postId, author, content, authorId, parentId });
  return addLocalReply(postId, author, content, authorId, parentId);
}

export function incrementViews(postId: number): void {
  if (isSupabaseConfigured()) {
    // Supabase 增加浏览数（异步，不等待）
    import("./supabase").then(({ incrementViews: supabaseIncrement }) => {
      supabaseIncrement(postId);
    });
  }

  incrementLocalViews(postId);
}

export function formatTime(createdAt: number): string {
  const diff = Date.now() - createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}
