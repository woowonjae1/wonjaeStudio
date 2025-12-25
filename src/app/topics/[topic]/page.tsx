import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui";
import { getPostsByTopic, getAllTopics } from "@/lib/content";
import { formatDate } from "@/lib/markdown";
import { Metadata } from "next";

interface TopicPageProps {
  params: { topic: string };
}

// 主题元数据
const topicMeta: Record<string, { name: string; description: string }> = {
  "music-theory": {
    name: "乐理学习",
    description: "音乐理论基础知识，包括和声、节奏、曲式分析等",
  },
  "listening-notes": {
    name: "聆听笔记",
    description: "专辑和歌曲的聆听感想与分析",
  },
  composition: {
    name: "创作心得",
    description: "音乐创作过程中的思考与经验分享",
  },
  practice: {
    name: "练习日志",
    description: "乐器练习记录与技巧总结",
  },
};

// 生成静态路径
export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topic: topic.slug,
  }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const meta = topicMeta[params.topic];

  if (!meta) {
    return { title: "主题未找到" };
  }

  return {
    title: `${meta.name} - WOOWONJAE`,
    description: meta.description,
  };
}

export default function TopicPage({ params }: TopicPageProps) {
  const meta = topicMeta[params.topic];

  if (!meta) {
    notFound();
  }

  const posts = getPostsByTopic(params.topic);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="py-16">
        <Container>
          {/* 面包屑导航 */}
          <nav className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link
              href="/"
              className="hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              首页
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/topics"
              className="hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              主题
            </Link>
            <span className="mx-2">/</span>
            <span style={{ color: "var(--text-primary)" }}>{meta.name}</span>
          </nav>

          {/* 主题头部 */}
          <header className="text-center mb-12">
            <h1
              className="text-2xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {meta.name}
            </h1>
            <p
              className="text-base mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {meta.description}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              共 {posts.length} 篇笔记
            </p>
          </header>

          {/* 文章列表 */}
          {posts.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/notes/${post.slug}`}
                  className="block p-5 rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h2
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {post.summary}
                  </p>
                  <div
                    className="flex items-center gap-4 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.readingTime} 分钟阅读</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                该主题下暂无笔记
              </p>
              <Link
                href="/notes/new"
                className="inline-block px-4 py-2 text-sm rounded-md"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                创建第一篇笔记
              </Link>
            </div>
          )}

          {/* 返回链接 */}
          <div className="text-center mt-12">
            <Link
              href="/topics"
              className="inline-block px-4 py-2 text-sm rounded-md transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              返回所有主题
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
