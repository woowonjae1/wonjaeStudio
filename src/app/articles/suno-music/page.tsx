import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Suno AI 推出音乐生成新功能';
const date = '2024.05.29';
const author = 'woowonjae';
const prevArticle = { title: 'Google Gemini 2.0 多模态AI模型发布', slug: 'gemini-2' };
const nextArticle = { title: 'OpenAI GPT-5 研究进展解读', slug: 'gpt5-progress' };
const content = `2024年5月29日，AI音乐生成平台Suno AI宣布推出一系列创新功能。新版本支持更精准的风格控制和乐器组合，用户可以通过简短的文本描述生成完整的多轨音乐作品。此次更新还引入了实时编辑功能，创作者可以在生成过程中调整音乐参数，实现更个性化的创作体验。值得一提的是，Suno AI还优化了中文歌词的识别和演唱能力，为中文音乐创作者提供了更好的支持。业内人士评价，此次更新标志着AI音乐创作工具向专业音乐制作领域迈进了一大步。`;

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
        category="suno-music"
      />
    </div>
  );
} 