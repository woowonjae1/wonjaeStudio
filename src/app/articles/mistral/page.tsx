import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Mistral AI 发布开源大模型';
const date = '2024.05.15';
const author = 'woowonjae';
const prevArticle = { title: 'Stable Audio 2.0 支持更高质量音频生成', slug: 'stable-audio-2' };
const nextArticle = { title: 'AI Agent 生态系统盘点', slug: 'ai-agents' };
const content = `2024年5月15日，法国创业公司Mistral AI宣布开源其最新大语言模型。这款模型在多项评测中表现优异，特别是在逻辑推理、代码生成和多语言理解方面，达到了业界领先水平。Mistral AI采用了创新的参数共享架构，使得模型能在有限的计算资源下实现更高的性能。此次开源发布包括完整的模型权重、训练方法和推理代码，以及详细的技术文档。Mistral AI表示，开源策略将促进学术研究和应用创新，推动AI技术的民主化。业内专家认为，这一举措将加速大语言模型在全球范围内的落地应用。`;

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
        category="mistral"
      />
    </div>
  );
} 