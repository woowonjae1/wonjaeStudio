import React from 'react';
import Image from 'next/image';

export default function CopilotXArticle() {
  return (
    <div className="max-w-5xl min-h-[700px] mx-auto flex flex-col justify-center py-16 px-4 md:px-8 bg-white rounded-2xl shadow-lg text-center mt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#232323] leading-tight text-center">
        GitHub Copilot X 正式发布，AI辅助开发再升级
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center text-gray-500 text-base mb-10 gap-2 text-center">
        <span>作者：Woowonjae</span>
        <span className="hidden md:inline">|</span>
        <span>发布日期：2024-06-01</span>
      </div>
      <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 mx-auto text-center">
        <p>
          2024年6月，GitHub Copilot X 正式发布，标志着AI辅助开发进入全新阶段。作为Copilot的升级版，Copilot X不仅支持代码自动补全，还集成了Chat、语音、Pull Request智能分析等多项AI能力，为开发者带来前所未有的高效体验。
        </p>
        <h2>Copilot X 主要特性</h2>
        <ul className="list-disc list-inside inline-block text-left mx-auto">
          <li>AI 聊天助手：可在编辑器内与AI对话，实时解答开发疑问。</li>
          <li>PR 智能分析：自动总结、解释 Pull Request 变更，提升协作效率。</li>
          <li>语音指令：支持语音输入代码、描述需求，极大提升开发便捷性。</li>
          <li>文档生成：自动为代码生成注释和文档，降低维护成本。</li>
          <li>多语言支持：覆盖主流编程语言，适配多种开发场景。</li>
        </ul>
        <h2>使用体验</h2>
        <p>
          Copilot X 在实际开发中表现出色。无论是日常编码、查找Bug，还是团队协作，都能显著提升效率。AI助手不仅能补全代码，还能解释复杂逻辑、推荐最佳实践，让开发者专注于业务创新。
        </p>
        <h2>未来展望</h2>
        <p>
          随着AI技术不断进步，Copilot X 有望成为开发者不可或缺的智能伙伴。未来，更多个性化、自动化的AI能力将持续集成，推动软件开发迈向智能化新时代。
        </p>
        <blockquote className="mx-auto text-center">
          <p>“Copilot X 让每一位开发者都能拥有专属的AI助手，释放创造力，专注于更有价值的创新。”</p>
        </blockquote>
      </article>
    </div>
  );
} 