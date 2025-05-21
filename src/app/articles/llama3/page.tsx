import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = '开源大模型 Llama 3 开放下载';
const date = '2024.05.20';
const author = 'woowonjae';
const category = 'llama3';
const prevArticle = { title: 'Gitee 开源社区年度报告发布', slug: 'gitee-report' };
const nextArticle = { title: 'OpenAI 发布全新 API 价格方案', slug: 'openai-api-pricing' };
const content = `2024年5月20日，Meta宣布开源大语言模型Llama 3，向全球开发者开放下载。Llama 3在多项自然语言处理任务上表现优异，支持更大规模的参数和多语言能力。此次开源不仅提供了模型权重，还附带详细的训练数据和推理代码，便于研究者和企业进行二次开发。Llama 3的开放被认为将进一步推动AI技术的普及和创新，降低大模型应用门槛，促进学术与产业的深度合作。`;

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