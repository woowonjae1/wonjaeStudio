import Link from "next/link";
import { Container } from "@/components/ui";
import { HomeDottedSurface } from "@/components/ui/dotted-surface-variants";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      {/* 背景动画 */}
      <HomeDottedSurface />

      <Container className="relative z-10">
        <div className="text-center">
          {/* 个人标识 */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl font-bold mb-8">
            WJ
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            页面未找到
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            抱歉，你访问的页面不存在。可能是链接错误或页面已被移动。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              回到首页
            </Link>

            <Link
              href="/notes/new"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              写新笔记
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>如果你认为这是一个错误，请联系 WOOWONJAE</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
