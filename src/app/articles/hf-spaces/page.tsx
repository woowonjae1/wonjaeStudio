import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Hugging Face Spaces 热门项目推荐';
const date = '2024.05.01';
const author = 'woowonjae';
const prevArticle = { title: 'LangChain 生态持续壮大', slug: 'langchain' };
const nextArticle = { title: '开源中国 OSC 2024 年度盛典', slug: 'osc-2024' };
const content = `2024年5月1日，Hugging Face Spaces 平台发布了最新热门项目榜单。榜单涵盖了文本生成、图像识别、语音合成等多个领域的创新应用。开发者可以通过 Spaces 快速体验和部署 AI 模型，推动了 AI 技术的普及和落地。社区活跃度持续提升，越来越多的开源项目在 Spaces 上获得关注和实践机会。`;

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
        category="hf-spaces"
      />
    </div>
  );
} 