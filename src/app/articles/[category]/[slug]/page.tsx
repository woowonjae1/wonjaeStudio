import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';
import { generateArticleContent } from '@/utils/articleContentGenerator';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

// 模拟获取文章数据
async function getArticleData(category: string, slug: string) {
  // 这里应该从数据库或API获取实际数据
  return {
    title: '示例文章标题',
    date: '2024-04-28',
    author: 'woowonjae',
    category,
    slug,
  };
}

// 模拟获取相邻文章
async function getAdjacentArticles(category: string, currentSlug: string) {
  // 这里应该从数据库或API获取实际数据
  return {
    prevArticle: {
      title: '上一篇文章',
      slug: 'prev-article',
    },
    nextArticle: {
      title: '下一篇文章',
      slug: 'next-article',
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = params;
  const article = await getArticleData(category, slug);
  const { prevArticle, nextArticle } = await getAdjacentArticles(category, slug);
  const { summary, content } = generateArticleContent(article.title, article.date);

  return (
    <div className="max-w-5xl min-h-[700px] mx-auto flex flex-col justify-center py-16 px-4 md:px-8 bg-white rounded-2xl shadow-lg text-center mt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#232323] leading-tight text-center">
        {article.title}
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center text-gray-500 text-base mb-10 gap-2 text-center">
        <span>作者：{article.author}</span>
        <span className="hidden md:inline">|</span>
        <span>发布日期：{article.date}</span>
      </div>
      
      <div className="text-gray-600 mb-8 italic">
        {summary}
      </div>

      <article 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 mx-auto text-left"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <ArticleNavigation
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        category={category}
      />
    </div>
  );
} 