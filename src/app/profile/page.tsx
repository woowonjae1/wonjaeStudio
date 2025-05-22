"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [message, setMessage] = useState("");

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("请先登录");
      return;
    }
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      avatar_url: avatarUrl,
      hobbies: hobbies.split(",").map(h => h.trim()),
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("资料完善成功！");
    }
  };

  return (
    <form onSubmit={handleProfile} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>完善资料 / Complete Profile</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="昵称 / Nickname"
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        value={avatarUrl}
        onChange={e => setAvatarUrl(e.target.value)}
        placeholder="头像URL / Avatar URL"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        value={hobbies}
        onChange={e => setHobbies(e.target.value)}
        placeholder="爱好（用逗号分隔）/ Hobbies (comma separated)"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit" style={{ width: "100%" }}>提交</button>
      <div style={{ color: message.includes("成功") ? "green" : "red", marginTop: 8 }}>{message}</div>
    </form>
  );
} 