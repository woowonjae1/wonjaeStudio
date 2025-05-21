import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Stable Diffusion 3.0 社区贡献榜';
const date = '2024.05.10';
const author = 'woowonjae';
const category = 'stable-diffusion-3';
const prevArticle = { title: 'OpenAI 发布全新 API 价格方案', slug: 'openai-api-pricing' };
const nextArticle = undefined;
const content = `2024年5月10日，Stable Diffusion 3.0 社区贡献榜正式发布。榜单展示了在模型优化、插件开发、数据集整理等方面做出突出贡献的开发者和团队。Stable Diffusion 3.0作为领先的开源图像生成模型，吸引了全球大量AI爱好者参与。社区的活跃推动了模型性能持续提升和应用场景拓展。官方表示，未来将继续完善激励机制，鼓励更多开发者参与开源创新。`;

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