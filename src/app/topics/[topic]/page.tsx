import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Tag } from "@/components/ui";
import { ArticleDottedSurface } from "@/components/ui/dotted-surface-variants";
import { getPostsByTopic, getAllTopics } from "@/lib/content";
import { formatDate } from "@/lib/markdown";
import { Metadata } from "next";

interface TopicPageProps {
  params: { topic: string };
}

// 主题元数据
const topicMeta: Record<
  string,
  { name: string; icon: string; description: string }
> = {
  "music-theory": {
    name: "乐理学习",
    icon: "🎼",
    description: "音乐理论基础知识，包括和声、节奏、曲式分析等",
  },
  "listening-notes": {
    name: "聆听笔记",
    icon: "🎧",
    description: "专辑和歌曲的聆听感想与分析",
  },
  composition: {
    name: "创作心得",
    icon: "✍️",
    description: "音乐创作过程中的思考与经验分享",
  },
  practice: {
    name: "练习日志",
    icon: "🎹",
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
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <ArticleDottedSurface />

      <div className="relative z-10 py-16">
        <Container>
          {/* 面包屑导航 */}
          <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              首页
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/topics"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              主题
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{meta.name}</span>
          </nav>

          {/* 主题头部 */}
          <header className="text-center mb-12">
            <span className="text-5xl mb-4 block">{meta.icon}</span>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
              {meta.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              {meta.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              共 {posts.length} 篇笔记
            </p>
          </header>

          {/* 文章列表 */}
          {posts.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/notes/${post.slug}`}
                  className="group block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 truncate">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
                        {post.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span>{post.readingTime} 分钟阅读</span>
                      </div>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Tag key={tag} size="sm">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                该主题下暂无笔记
              </p>
              <Link
                href="/notes/new"
                className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                创建第一篇笔记
              </Link>
            </div>
          )}

          {/* 返回链接 */}
          <div className="text-center mt-12">
            <Link
              href="/topics"
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← 返回所有主题
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
