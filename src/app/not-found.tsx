import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-light text-black dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 font-light">
          页面未找到
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-light rounded-lg hover:opacity-80 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
