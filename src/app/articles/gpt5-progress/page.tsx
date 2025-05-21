import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'OpenAI GPT-5 研究进展解读';
const date = '2024.05.25';
const author = 'woowonjae';
const prevArticle = { title: 'Suno AI 推出音乐生成新功能', slug: 'suno-music' };
const nextArticle = { title: 'Stable Audio 2.0 支持更高质量音频生成', slug: 'stable-audio-2' };
const content = `2024年5月25日，OpenAI首席科学家Ilya Sutskever在一场技术峰会上分享了GPT-5的研究进展。根据透露的信息，GPT-5在多轮对话、长文本记忆和推理能力方面取得了显著突破。新模型采用了创新的训练方法，大幅提升了理解复杂指令和生成精确回应的能力。尽管OpenAI尚未公布具体发布日期，但业内预测GPT-5可能在2024年底前推出。专家评价，GPT-5的研发方向更注重可靠性和安全性，这表明大型语言模型正朝着更负责任的方向发展。`;

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
        category="gpt5-progress"
      />
    </div>
  );
} 