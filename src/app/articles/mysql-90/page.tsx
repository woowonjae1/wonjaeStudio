import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'MySQL 9.0 性能优化实践';
const date = '2024.05.25';
const author = 'woowonjae';
const prevArticle = { title: 'Spring Boot 3.2 新特性', slug: 'springboot-32' };
const nextArticle = { title: 'Kubernetes 1.30 发布', slug: 'k8s-130' };
const content = `2024年5月25日，随着MySQL 9.0的正式发布，我们对其性能优化进行了深入实践和测试。新版MySQL在查询优化器、并行处理能力和内存管理方面都有显著提升。实测表明，在大型数据集上，复杂查询性能提升了35%-50%，写入吞吐量增加约25%。MySQL 9.0引入的列式存储引擎特别适合分析型工作负载，能将某些聚合查询速度提高10倍以上。此外，新版本对JSON数据类型的操作优化使相关查询效率提升约40%。在实践中，我们发现合理配置新增的自适应查询优化和智能索引推荐功能，能进一步提升性能。值得注意的是，升级到MySQL 9.0需要关注存储引擎兼容性和SQL语法变化，建议在迁移前进行充分的测试和评估。`;

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
        category="mysql-90"
      />
    </div>
  );
} 