import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// 使用默认值以便开发时可以运行，生产环境必须配置真实值
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// 自动添加 https:// 前缀（如果缺失）
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = `https://${supabaseUrl}`;
  console.warn(`⚠️  自动添加 https:// 前缀到 Supabase URL: ${supabaseUrl}`);
}

const isDemo = supabaseUrl === "https://demo.supabase.co";

if (isDemo) {
  console.warn("⚠️  使用本地演示模式（Supabase 演示配置）");
  console.warn("📝 生产环境请配置真实的 Supabase 密钥");
  console.warn(
    "💡 编辑 .env.local 配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// 客户端 Supabase 实例（用于浏览器）
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  global: {
    headers: {
      "X-Client-Info": "supabase-js-web",
    },
    fetch: (url, options = {}) => {
      // 添加超时和更好的错误处理
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      return fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: "same-origin",
      })
        .then((response) => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          if (error.name === "AbortError") {
            throw new Error("请求超时，请检查网络连接");
          }
          throw error;
        });
    },
  },
});

// 服务端 Supabase 实例（用于 API routes，使用 service role key）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export { isDemo };
