"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUserIdentity, UserIdentity } from "@/lib/userIdentity";
import { addPost } from "@/lib/communityStorage";
import "../community.css";
import "./new-post.css";

const categories = [
  { id: "production", name: "编曲" },
  { id: "mixing", name: "混音" },
  { id: "plugins", name: "插件" },
  { id: "showcase", name: "作品" },
  { id: "help", name: "问答" },
];

const availableTags = [
  "EQ",
  "压缩",
  "混响",
  "人声",
  "鼓组",
  "贝斯",
  "母带",
  "合成器",
  "采样",
  "新手",
  "进阶",
  "教程",
];

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUser(getUserIdentity());
  }, []);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !category || !content.trim()) return;

    setSubmitting(true);

    const newPost = await addPost({
      title: title.trim(),
      category,
      tags,
      author: user.username,
      content: content.trim(),
      time: "刚刚",
      authorId: user.id,
    });

    router.push(`/community/post/${newPost.id}`);
  };

  const isValid = title.trim() && category && content.trim();

  return (
    <div className="community-page">
      <Navbar />

      <div className="new-post-layout">
        <div className="new-post-container">
          <div className="breadcrumb">
            <button onClick={() => router.push("/community")}>← 返回</button>
          </div>

          <h1>新话题</h1>

          {user && (
            <p className="posting-as">
              以 <strong>{user.username}</strong> 身份发布
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>标题</label>
              <input
                type="text"
                placeholder="话题标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="field">
              <label>分类</label>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={category === cat.id ? "active" : ""}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>
                标签 <span className="hint">最多选 3 个</span>
              </label>
              <div className="tags-list">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-btn ${tags.includes(tag) ? "active" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {tags.length > 0 && (
                <div className="selected-tags">已选：{tags.join("、")}</div>
              )}
            </div>

            <div className="field">
              <label>内容</label>
              <textarea
                placeholder="话题内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
              />
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => router.back()}
              >
                取消
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={!isValid || submitting}
              >
                {submitting ? "发布中..." : "发布"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
