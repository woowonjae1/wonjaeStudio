import React from "react";
import { Container } from "@/components/ui";
import { HomeDottedSurface } from "@/components/ui/dotted-surface-variants";
import { NoteGrid } from "@/components/blog/NoteCard";
import { Pagination } from "@/components/blog";
import { getPaginatedPosts } from "@/lib/content";
import Link from "next/link";

interface HomePageProps {
  searchParams: { page?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const postsPerPage = 12;

  const { posts, totalPages, totalPosts } = getPaginatedPosts(
    currentPage,
    postsPerPage
  );

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* 主页专用背景 */}
      <HomeDottedSurface />

      <Container className="relative z-10">
        <div className="py-16">
          {/* Hero Section - 简化 */}
          <section className="text-center mb-16">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl font-bold mb-6">
                WJ
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                WOOWONJAE
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                音乐制作人的学习笔记与创作感悟
              </p>

              {/* Stats - 简化 */}
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {totalPosts}
                  </div>
                  <div className="text-gray-500">篇笔记</div>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {new Date().getFullYear()}
                  </div>
                  <div className="text-gray-500">年创立</div>
                </div>
              </div>

              <Link
                href="/notes/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                写新笔记
              </Link>
            </div>
          </section>

          {/* Notes Grid */}
          <section>
            <NoteGrid
              posts={posts}
              emptyMessage="还没有写过笔记，点击上方按钮开始记录吧！"
              showSignature={false}
            />
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/"
              />
            </section>
          )}

          {/* Footer Signature - 简化 */}
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Made by{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  WOOWONJAE
                </span>{" "}
                © {new Date().getFullYear()}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
