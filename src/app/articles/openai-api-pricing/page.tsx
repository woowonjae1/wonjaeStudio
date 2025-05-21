import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'OpenAI 发布全新 API 价格方案';
const date = '2024.05.15';
const author = 'woowonjae';
const category = 'openai-api-pricing';
const prevArticle = { title: '开源大模型 Llama 3 开放下载', slug: 'llama3' };
const nextArticle = { title: 'Stable Diffusion 3.0 社区贡献榜', slug: 'stable-diffusion-3' };
const content = `2024年5月15日，OpenAI公布了全新的API价格方案，旨在让更多开发者和企业能够低成本接入先进的AI能力。新方案对不同模型和调用量进行了分级定价，部分基础模型价格大幅下调，同时引入了更灵活的计费方式。OpenAI还宣布将为教育、公益等领域提供专项优惠。此次价格调整有望加速AI应用的落地，推动AI技术的普惠化。`;

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
        category={category}
      />
    </div>
  );
} 