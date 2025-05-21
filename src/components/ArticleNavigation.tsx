import Link from 'next/link';

interface ArticleNavigationProps {
  prevArticle?: {
    title: string;
    slug: string;
  };
  nextArticle?: {
    title: string;
    slug: string;
  };
  category: string;
}

export default function ArticleNavigation({ prevArticle, nextArticle, category }: ArticleNavigationProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
      <Link
        href="/"
        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
      >
        返回首页
      </Link>
      
      <div className="flex gap-4">
        {prevArticle && (
          <Link
            href={`/articles/${prevArticle.slug}`}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            上一篇：{prevArticle.title}
          </Link>
        )}
        {nextArticle && (
          <Link
            href={`/articles/${nextArticle.slug}`}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            下一篇：{nextArticle.title}
          </Link>
        )}
      </div>
    </div>
  );
} 