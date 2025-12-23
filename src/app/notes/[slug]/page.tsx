import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Tag } from "@/components/ui";
import { MusicEmbed } from "@/components/blog";
import {
  getPostBySlug,
  getAdjacentPosts,
  getAllPosts,
  getSiteConfig,
} from "@/lib/content";
import { markdownToHtml, formatDate } from "@/lib/markdown";
import { Metadata } from "next";

interface PostPageProps {
  params: { slug: string };
}

// 生成静态路径
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  const siteConfig = getSiteConfig();

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: `${post.title} - ${siteConfig.site.title}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.site.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(params.slug);
  const renderedContent = await markdownToHtml(post.content);

  return (
    <div className="py-16">
      <Container>
        {/* 面包屑导航 */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/notes"
            className="hover:text-foreground transition-colors"
          >
            笔记
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* 文章头部 */}
        <header className="blog-section text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime} 分钟阅读</span>
            {post.topics.length > 0 && (
              <span>分类：{post.topics.join(", ")}</span>
            )}
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {post.tags.map((tag) => (
                <Tag key={tag} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* 摘要 */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {post.summary}
          </p>
        </header>

        {/* 音乐嵌入 */}
        {post.musicEmbed && (
          <section className="blog-section">
            <MusicEmbed
              url={post.musicEmbed}
              title="相关音乐"
              className="max-w-2xl mx-auto"
            />
          </section>
        )}

        {/* 文章内容 */}
        <article className="blog-section">
          <div
            className="prose prose-gray dark:prose-invert max-w-none mx-auto
                       prose-headings:font-semibold prose-headings:text-foreground
                       prose-p:text-foreground prose-p:leading-relaxed
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-code:text-foreground prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                       prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                       prose-ul:text-foreground prose-ol:text-foreground
                       prose-li:text-foreground prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        </article>

        {/* 文章导航 */}
        {(prev || next) && (
          <nav className="blog-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 上一篇 */}
              <div>
                {prev ? (
                  <Link
                    href={`/notes/${prev.slug}`}
                    className="block p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors group"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      ← 上一篇
                    </div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {prev.title}
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 border border-border/50 rounded-lg text-muted-foreground/50">
                    <div className="text-sm mb-1">← 上一篇</div>
                    <div>没有更多文章</div>
                  </div>
                )}
              </div>

              {/* 下一篇 */}
              <div>
                {next ? (
                  <Link
                    href={`/notes/${next.slug}`}
                    className="block p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors group text-right"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      下一篇 →
                    </div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {next.title}
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 border border-border/50 rounded-lg text-muted-foreground/50 text-right">
                    <div className="text-sm mb-1">下一篇 →</div>
                    <div>没有更多文章</div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* 返回列表 */}
        <div className="blog-section text-center">
          <Link
            href="/notes"
            className="inline-flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/20 transition-colors"
          >
            ← 返回所有笔记
          </Link>
        </div>
      </Container>
    </div>
  );
}
