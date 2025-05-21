import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Stable Audio 2.0 支持更高质量音频生成';
const date = '2024.05.20';
const author = 'woowonjae';
const prevArticle = { title: 'OpenAI GPT-5 研究进展解读', slug: 'gpt5-progress' };
const nextArticle = { title: 'Mistral AI 发布开源大模型', slug: 'mistral' };
const content = `2024年5月20日，Stability AI发布了Stable Audio 2.0版本，在音频生成质量上取得重大突破。新版本能够生成长达10分钟的高保真音频，支持多种音乐风格和音效类型，并大幅提升了音色真实度和音乐结构的连贯性。Stable Audio 2.0采用了全新的音频编码模型和增强的生成算法，使其能够更准确理解用户的音频描述需求。此次更新还增加了多语言提示词支持，包括中文在内的多种语言均可用于描述所需生成的音频。音乐制作者和游戏开发者表示，这一工具将显著加速音频内容的原型设计和创作过程。`;

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
        category="stable-audio-2"
      />
    </div>
  );
} 