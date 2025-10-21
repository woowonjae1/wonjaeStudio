"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/hooks/useAuth";
import { isDemo } from "@/lib/supabase";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isDemo) {
        // 演示模式：直接创建本地账户
        const demoUser = {
          id: "demo-" + Date.now(),
          email: email || "demo@example.com",
          displayName: displayName || "Demo User",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("demo_user", JSON.stringify(demoUser));
        localStorage.setItem("demo_session_token", "demo-token-" + Date.now());
        setSuccess(true);

        setTimeout(() => {
          router.push("/home");
        }, 2000);
        return;
      }

      // 真实模式：使用 Supabase
      await signUpWithEmail(email, password, displayName);
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes("fetch") && isDemo) {
        setSuccess(true);
        setTimeout(() => {
          const demoUser = {
            id: "demo-" + Date.now(),
            email: email || "demo@example.com",
            displayName: displayName || "Demo User",
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
        setError(err.message || "注册失败，请重试");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">✅ 注册成功！</h2>
        <p className="text-gray-600">
          {isDemo
            ? "已创建演示账户，正在重定向..."
            : "请查收您的邮箱，点击确认链接完成注册。"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">注册</h2>

      {isDemo && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-sm">
          💡 演示模式：输入任意信息即可注册
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">用户名</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={isDemo ? "例如：张三" : "Your name"}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isDemo ? "任意邮箱格式" : "user@example.com"}
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
            placeholder={isDemo ? "演示模式可随意输入" : "至少 6 个字符"}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            minLength={isDemo ? 1 : 6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>
    </div>
  );
}
