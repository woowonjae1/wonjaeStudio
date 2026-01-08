import { supabase, VocabularyRow } from "./supabase";

export interface WordData {
  word: string;
  phonetic: string;
  meaning: string;
  pos: string;
  example: string;
  exampleCn: string;
  level: "basic" | "cet4" | "cet6" | "ielts" | "advanced";
  tags: string[];
}

// 将数据库行转换为前端格式
function rowToWordData(row: VocabularyRow): WordData {
  return {
    word: row.word,
    phonetic: row.phonetic || "",
    meaning: row.meaning,
    pos: row.pos || "",
    example: row.example || "",
    exampleCn: row.example_cn || "",
    level: row.level,
    tags: row.tags || [],
  };
}

// 获取所有词汇
export async function getAllVocabulary(): Promise<WordData[]> {
  const { data, error } = await supabase
    .from("vocabulary")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("获取词汇失败:", error);
    return [];
  }

  return (data || []).map(rowToWordData);
}

// 分页获取词汇
export async function getVocabularyPaginated(
  page: number = 1,
  pageSize: number = 50
): Promise<{ data: WordData[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("vocabulary")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("获取词汇失败:", error);
    return { data: [], total: 0 };
  }

  return {
    data: (data || []).map(rowToWordData),
    total: count || 0,
  };
}

// 按等级获取词汇
export async function getVocabularyByLevel(
  level: WordData["level"]
): Promise<WordData[]> {
  const { data, error } = await supabase
    .from("vocabulary")
    .select("*")
    .eq("level", level)
    .order("id", { ascending: true });

  if (error) {
    console.error("获取词汇失败:", error);
    return [];
  }

  return (data || []).map(rowToWordData);
}

// 搜索词汇
export async function searchVocabulary(query: string): Promise<WordData[]> {
  const { data, error } = await supabase
    .from("vocabulary")
    .select("*")
    .or(`word.ilike.%${query}%,meaning.ilike.%${query}%`)
    .limit(50);

  if (error) {
    console.error("搜索词汇失败:", error);
    return [];
  }

  return (data || []).map(rowToWordData);
}

// 获取随机词汇
export async function getRandomVocabulary(
  count: number = 10
): Promise<WordData[]> {
  // Supabase 不直接支持随机，用 RPC 或获取全部后随机
  const { data, error } = await supabase.from("vocabulary").select("*");

  if (error || !data) {
    console.error("获取词汇失败:", error);
    return [];
  }

  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(rowToWordData);
}

// 获取词汇总数
export async function getVocabularyCount(): Promise<number> {
  const { count, error } = await supabase
    .from("vocabulary")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("获取词汇数量失败:", error);
    return 0;
  }

  return count || 0;
}
