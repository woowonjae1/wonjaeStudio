import React from "react";
import { Container } from "@/components/ui";
import { ArticleList, Pagination } from "@/components/blog";
import { getPaginatedPosts, getSiteConfig } from "@/lib/content";
import { Metadata } from "next";

interface NotesPageProps {
  searchParams: { page?: string };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();

  return {
    title: `所有笔记 - ${siteConfig.site.title}`,
    description: "浏览所有音乐学习和聆听笔记",
  };
}

export default function NotesPage({ searchParams }: NotesPageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const postsPerPage = 10;

  const { posts, totalPages, totalPosts } = getPaginatedPosts(
    currentPage,
    postsPerPage
  );
  const siteConfig = getSiteConfig();

  return (
    <div className="py-16">
      <Container>
        {/* 页面标题 */}
        <div className="blog-section text-center">
          <h1 className="text-3xl font-semibold mb-4">所有笔记</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            探索所有音乐学习和聆听的记录，共 {totalPosts} 篇文章
          </p>
        </div>

        {/* 文章列表 */}
        <section className="blog-section">
          <ArticleList
            posts={posts}
            variant="default"
            showTags={true}
            showReadingTime={true}
            emptyMessage="暂无文章发布"
          />
        </section>

        {/* 分页导航 */}
        {totalPages > 1 && (
          <section className="blog-section">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/notes"
            />
          </section>
        )}
      </Container>
    </div>
  );
}
