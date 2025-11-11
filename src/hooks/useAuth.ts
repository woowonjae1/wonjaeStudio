import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}

// 登录
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 提供更友好的错误消息
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("邮箱或密码错误");
      }
      if (error.message.includes("Email not confirmed")) {
        throw new Error("请先验证邮箱");
      }
      if (error.message.includes("fetch")) {
        throw new Error("网络连接失败，请检查网络或Supabase配置");
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    if (error.message === "Failed to fetch") {
      throw new Error(
        "无法连接到服务器，请检查:\n1. 网络连接\n2. .env.local 中的 Supabase URL 是否正确\n3. Supabase 项目是否正常运行"
      );
    }
    throw error;
  }
}

// 注册
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// 社交登录
export async function signInWithProvider(
  provider: "google" | "github" | "discord"
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// 登出
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 重置密码
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
  return data;
}

// 更新密码
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

// 更新用户资料
export async function updateProfile(updates: {
  display_name?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });

  if (error) throw error;
  return data;
}
