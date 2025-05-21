import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Python 3.13 新特性前瞻';
const date = '2024.04.20';
const author = 'woowonjae';
const prevArticle = { title: '开源中国 OSC 2024 年度盛典', slug: 'osc-2024' };
const nextArticle = { title: 'Kaggle 社区最新竞赛资讯', slug: 'kaggle-news' };
const content = `2024年4月20日，Python 官方公布了 3.13 版本的主要新特性。新版本在性能优化、类型注解、语法糖等方面带来诸多改进。开发者将体验到更快的解释器、更丰富的标准库以及更友好的类型提示。社区普遍认为，Python 3.13 的发布将进一步巩固其在数据科学、AI 和 Web 开发领域的主流地位。`;

export default function Page() {
  return (
    <div className="max-w-5xl min-h-[700px] mx-auto flex flex-col justify-center py-16 px-4 md:px-8 bg-white rounded-2xl shadow-lg text-center mt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#232323] leading-tight text-center">
        {title}
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center text-gray-500 text-base mb-10 gap-2 text-center">
        <span>作者：{author}</span>
        <span className="hidden md:inline">|</span>
        <span>发布日期：{date}</span>
      </div>
      <article
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 mx-auto text-left"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <ArticleNavigation
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        category="python-313"
      />
    </div>
  );
} 