import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 只在有配置时创建客户端
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// 检查是否可用
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

// 类型定义
export interface Topic {
  id: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author_name: string;
  author_id: string;
  views: number;
  pinned: boolean;
  created_at: string;
  replies_count?: number;
}

export interface Reply {
  id: number;
  topic_id: number;
  content: string;
  author_name: string;
  author_id: string;
  created_at: string;
}

// 获取所有话题
export async function getTopics(category?: string): Promise<Topic[]> {
  if (!supabase) return [];

  let query = supabase
    .from("community_topics")
    .select("*, replies_count:community_replies(count)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return (data || []).map((topic: any) => ({
    ...topic,
    replies_count: topic.replies_count?.[0]?.count || 0,
  }));
}

// 获取单个话题
export async function getTopic(id: number): Promise<Topic | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("community_topics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching topic:", error);
    return null;
  }

  return data;
}

// 创建话题
export async function createTopic(topic: {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author_name: string;
  author_id: string;
}): Promise<Topic | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("community_topics")
    .insert([topic])
    .select()
    .single();

  if (error) {
    console.error("Error creating topic:", error);
    return null;
  }

  return data;
}

// 增加浏览数
export async function incrementViews(id: number): Promise<void> {
  if (!supabase) return;

  try {
    const { data } = await supabase
      .from("community_topics")
      .select("views")
      .eq("id", id)
      .single();

    if (data) {
      await supabase
        .from("community_topics")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);
    }
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

// 获取话题的回复
export async function getReplies(topicId: number): Promise<Reply[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("community_replies")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }

  return data || [];
}

// 创建回复
export async function createReply(reply: {
  topic_id: number;
  content: string;
  author_name: string;
  author_id: string;
}): Promise<Reply | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("community_replies")
    .insert([reply])
    .select()
    .single();

  if (error) {
    console.error("Error creating reply:", error);
    return null;
  }

  return data;
}

// 格式化时间
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;

  return date.toLocaleDateString("zh-CN");
}
