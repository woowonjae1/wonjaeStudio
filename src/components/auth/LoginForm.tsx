"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithProvider } from "@/hooks/useAuth";
import { isDemo } from "@/lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 演示模式：直接登录
      if (isDemo) {
        // 存储演示用户信息到 localStorage
        const demoUser = {
          id: "demo-" + Date.now(),
          email: email || "demo@example.com",
          displayName: email?.split("@")[0] || "Demo User",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("demo_user", JSON.stringify(demoUser));
        localStorage.setItem("demo_session_token", "demo-token-" + Date.now());

        // 重定向到首页
        router.push("/home");
        return;
      }

      // 真实模式：使用 Supabase
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      // 如果是网络错误且处于演示模式，提示用户
      if (err.message?.includes("fetch") && isDemo) {
        setError("演示模式下无法连接真实 Supabase。已创建本地演示账户。");
        setTimeout(() => {
          const demoUser = {
            id: "demo-" + Date.now(),
            email: email || "demo@example.com",
            displayName: email?.split("@")[0] || "Demo User",
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem("demo_user", JSON.stringify(demoUser));
          localStorage.setItem(
            "demo_session_token",
            "demo-token-" + Date.now()
          );
          router.push("/home");
        }, 1500);
      } else {
        setError(err.message || "登录失败，请检查邮箱和密码");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      if (isDemo) {
        setError("演示模式下不支持社交登录。请使用邮箱登录。");
        return;
      }
      await signInWithProvider(provider);
    } catch (err: any) {
      setError(err.message || "登录失败");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">登录</h2>

      {isDemo && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-sm">
          💡 演示模式：输入任意邮箱即可登录
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isDemo ? "输入任意邮箱" : "user@example.com"}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isDemo ? "演示模式可随意输入" : "••••••••"}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "登录中..." : "登录"}
        </button>
      </form>

      {!isDemo && (
        <>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或使用</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Google
              </button>
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                GitHub
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
