import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Spring Boot 3.2 新特性';
const date = '2024.05.28';
const author = 'woowonjae';
const prevArticle = { title: 'Node.js 22 LTS 发布', slug: 'nodejs-22' };
const nextArticle = { title: 'MySQL 9.0 性能优化实践', slug: 'mysql-90' };
const content = `2024年5月28日，Spring团队正式发布了Spring Boot 3.2版本，带来了多项重要特性和优化。此版本基于Spring Framework 6.1构建，进一步提升了云原生应用开发体验。主要更新包括增强的AOT（Ahead of Time）编译支持，显著减少了应用启动时间；优化的GraalVM原生镜像支持，内存占用降低约20%；全新的纯异步响应式数据访问组件，提供更佳的性能和资源利用率。此外，Spring Boot 3.2还引入了更完善的可观测性功能，集成了Micrometer和OpenTelemetry，便于监控和故障排查。值得一提的是，该版本改进了对Docker容器的支持，优化了K8s环境中的资源使用效率。开发者可以通过官方文档获取详细的迁移指南和最佳实践建议。`;

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
        category="springboot-32"
      />
    </div>
  );
} 