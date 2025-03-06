import { FC } from 'react';

const BlogSection: FC = () => {
  return (
    <section id="blog" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Blog</h2>
        <p className="text-gray-600">
          查看我最新的音乐制作文章和教程。在这里我分享我的音乐创作过程和技巧。
        </p>
        {/* 博客文章列表可以在这里添加 */}
      </div>
    </section>
  );
};

export default BlogSection;