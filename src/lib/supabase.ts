import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 词汇表类型
export interface VocabularyRow {
  id: number;
  word: string;
  phonetic: string | null;
  meaning: string;
  pos: string | null;
  example: string | null;
  example_cn: string | null;
  level: "basic" | "cet4" | "cet6" | "ielts" | "advanced";
  tags: string[];
  created_at: string;
}
