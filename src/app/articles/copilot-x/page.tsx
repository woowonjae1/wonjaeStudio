import React from "react";
import ArticleNavigation from "@/components/ArticleNavigation";

const title = "GitHub Copilot X 正式发布，AI辅助开发再升级";
const date = "2024.06.01";
const author = "woowonjae";
const category = "copilot-x";
const prevArticle = undefined;
const nextArticle = {
  title: "Gitee 开源社区年度报告发布",
  slug: "gitee-report",
};
const content = `2024年6月1日，GitHub Copilot X 正式发布，标志着AI辅助开发进入全新阶段。Copilot X 不仅支持多种主流编程语言，还集成了聊天式编程助手、代码解释、自动补全、单元测试生成等功能。开发者可以通过自然语言描述需求，Copilot X 自动生成高质量代码片段，大幅提升开发效率。此次升级还引入了对Pull Request的智能分析和文档自动生成，极大改善了团队协作体验。业内专家认为，Copilot X 的发布将推动AI与软件开发的深度融合，成为未来开发者不可或缺的工具。`;

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