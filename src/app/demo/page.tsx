import {
  HomeDottedSurface,
  ArticleDottedSurface,
  EditorDottedSurface,
  CommunityDottedSurface,
  TutorialDottedSurface,
} from "@/components/ui/dotted-surface-variants";
import { Container } from "@/components/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DottedSurface Demo",
  description: "展示不同场景下的DottedSurface效果",
};

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* 使用主页背景 */}
      <HomeDottedSurface />

      <Container className="relative z-10 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            DottedSurface 演示
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这个页面展示了DottedSurface组件在不同场景下的应用效果。
            背景中的动态粒子会根据主题自动调整颜色。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">主页背景</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明度: 30% - 适合主页展示
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">文章页面</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明度: 20% - 不干扰阅读体验
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">编辑页面</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明度: 15% - 专注写作环境
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">社区页面</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明度: 10% - 不干扰内容浏览
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">教程页面</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明度: 15% - 保持专业感
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">技术特性</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Three.js + 主题感知 + 性能优化
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">使用方法</h3>
            <div className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  HomeDottedSurface
                </code>{" "}
                - 主页背景
              </p>
              <p>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  ArticleDottedSurface
                </code>{" "}
                - 文章页面背景
              </p>
              <p>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  EditorDottedSurface
                </code>{" "}
                - 编辑页面背景
              </p>
              <p>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  CommunityDottedSurface
                </code>{" "}
                - 社区页面背景
              </p>
              <p>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  TutorialDottedSurface
                </code>{" "}
                - 教程页面背景
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
