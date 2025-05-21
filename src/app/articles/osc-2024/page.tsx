import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = '开源中国 OSC 2024 年度盛典';
const date = '2024.04.28';
const author = 'woowonjae';
const prevArticle = { title: 'Hugging Face Spaces 热门项目推荐', slug: 'hf-spaces' };
const nextArticle = { title: 'Python 3.13 新特性前瞻', slug: 'python-313' };
const content = `2024年4月28日，开源中国 OSC 2024 年度盛典在北京隆重举行。盛典汇聚了众多开源领域专家、开发者和企业代表，围绕开源创新、社区治理、国产软件生态等话题展开深入交流。大会发布了年度优秀开源项目榜单，并表彰了社区活跃贡献者。此次盛典彰显了中国开源力量的持续壮大和国际影响力的提升。`;

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
        category="osc-2024"
      />
    </div>
  );
} 