import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Kaggle 社区最新竞赛资讯';
const date = '2024.04.15';
const author = 'woowonjae';
const prevArticle = { title: 'Python 3.13 新特性前瞻', slug: 'python-313' };
const nextArticle = undefined;
const content = `2024年4月15日，Kaggle 社区发布了最新竞赛资讯。近期上线的竞赛涵盖数据科学、机器学习、计算机视觉等多个领域，吸引了全球众多开发者参与。Kaggle 官方还推出了新的学习资源和社区活动，帮助参赛者提升技能、交流经验。业内人士认为，Kaggle 依然是数据科学领域最具影响力的竞赛与学习平台。`;

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
        category="kaggle-news"
      />
    </div>
  );
} 