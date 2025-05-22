"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [hobbies, setHobbies] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 拉取已存在的 profile 信息
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage("请先登录");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("profiles").select("username, avatar_url, hobbies").eq("id", user.id).single();
      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
        setAvatarPreview(data.avatar_url || "");
        setHobbies(Array.isArray(data.hobbies) ? data.hobbies.join(",") : (data.hobbies || ""));
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    // 上传到 Supabase Storage
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    }
  };

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("请先登录");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      avatar_url: avatarUrl,
      hobbies: hobbies.split(",").map(h => h.trim()),
    });
    if (error) {
      setMessage(error.message === 'duplicate key value violates unique constraint "profiles_pkey"' ? '资料已存在，请直接修改' : error.message);
    } else {
      setMessage("资料保存成功！");
    }
    setLoading(false);
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
        disabled={loading}
      />
      <div style={{ marginBottom: 8 }}>
        <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
        {avatarPreview && <img src={avatarPreview} alt="头像预览" style={{ width: 80, height: 80, borderRadius: "50%", marginTop: 8 }} />}
      </div>
      <input
        value={hobbies}
        onChange={e => setHobbies(e.target.value)}
        placeholder="爱好（用逗号分隔）/ Hobbies (comma separated)"
        style={{ width: "100%", marginBottom: 8 }}
        disabled={loading}
      />
      <button type="submit" style={{ width: "100%" }} disabled={loading}>{loading ? "保存中..." : "提交"}</button>
      <div style={{ color: message.includes("成功") ? "green" : "red", marginTop: 8 }}>{message}</div>
    </form>
  );
} 