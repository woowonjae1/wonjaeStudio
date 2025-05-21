import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'AI 语音合成新突破';
const date = '2024.04.20';
const author = 'woowonjae';
const prevArticle = { title: 'AI 代码自动补全工具对比', slug: 'ai-code-completion' };
const nextArticle = undefined;
const content = `2024年4月20日，AI语音合成技术迎来了重大突破。多家科技公司和研究机构发布了新一代语音合成模型，在情感表达、声音自然度和说话风格转换方面达到了前所未有的水平。这些新模型能够从极短的声音样本中捕捉说话者的声纹特征，并生成保留个人特色的高质量语音。尤为值得注意的是，最新的技术已经能够准确模拟说话者的情感状态、语调变化和呼吸节奏，使合成语音听起来几乎与真人无异。在中文语音合成领域，新模型对方言和地域口音的支持也有显著提升。专家认为，这一突破将加速语音合成技术在有声读物、数字人、语音助手等领域的应用，同时也带来了对声音隐私和身份保护的新挑战。`;

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
        category="ai-tts"
      />
    </div>
  );
} 