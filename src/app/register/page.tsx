"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("注册成功，请去邮箱激活账号！");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>注册 / Register</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="邮箱 / Email"
        type="email"
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="密码 / Password"
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit" style={{ width: "100%" }}>注册</button>
      <div style={{ color: message.includes("成功") ? "green" : "red", marginTop: 8 }}>{message}</div>
    </form>
  );
} 