import React from "react";
import { Container, Card, Tag } from "@/components/ui";
import { ArticleCard, ArticleList } from "@/components/blog";
import {
  getLatestPosts,
  getPinnedPost,
  getAllTopics,
  getSiteConfig,
} from "@/lib/content";
import Link from "next/link";
import { formatDate } from "@/lib/markdown";

export default function HomePage() {
  const siteConfig = getSiteConfig();
  const pinnedPost = getPinnedPost();
  const latestPosts = getLatestPosts(12); // 获取最新12篇文章
  const topics = getAllTopics();

  return (
    <div className="py-16">
      <Container>
        {/* Hero Section */}
        <section className="blog-section text-center">
          <h1 className="text-4xl font-semibold mb-4">
            {siteConfig.site.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {siteConfig.site.description}
          </p>
          <p className="text-base text-muted-foreground/80 mb-8 max-w-xl mx-auto">
            记录音乐学习的点滴，分享聆听的感悟，探索声音的奥秘
          </p>
          <Link href="/notes" className="btn btn-primary">
            开始阅读
          </Link>
        </section>

        {/* Pinned Post */}
        {pinnedPost && (
          <section className="blog-section">
            <h2 className="text-2xl font-semibold mb-6">推荐阅读</h2>
            <ArticleCard
              post={pinnedPost}
              variant="featured"
              showTags={true}
              showReadingTime={true}
            />
          </section>
        )}

        {/* Latest Posts */}
        <section className="blog-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">最新笔记</h2>
            <Link
              href="/notes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部 →
            </Link>
          </div>

          <ArticleList
            posts={latestPosts}
            variant="default"
            showTags={true}
            showReadingTime={true}
            emptyMessage="还没有发布任何笔记"
          />
        </section>

        {/* Topics */}
        {topics.length > 0 && (
          <section className="blog-section">
            <h2 className="text-2xl font-semibold mb-6">主题分类</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className="block p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <h3 className="font-medium mb-1">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                    {topic.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {topic.count} 篇文章
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
