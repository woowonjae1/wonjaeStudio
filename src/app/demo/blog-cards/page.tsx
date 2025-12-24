import { Blog7 } from "@/components/ui/blog7";
import { HomeDottedSurface } from "@/components/ui/dotted-surface-variants";
import { Container } from "@/components/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Cards Demo - WOOWONJAE",
  description: "展示新的博客卡片设计风格",
};

const demoData = {
  tagline: "WOOWONJAE 笔记",
  heading: "音乐制作笔记",
  description:
    "记录音乐学习的点滴，分享聆听的感悟，探索声音的奥秘。这里是我的音乐创作和学习心得的集合。",
  buttonText: "查看所有笔记",
  buttonUrl: "/",
  posts: [
    {
      id: "post-1",
      title: "Fabfilter Pro-Q3 EQ 使用心得",
      summary:
        "深入探讨这款业界标准EQ插件的使用技巧，从基础操作到高级应用，帮助你掌握专业的频率处理方法。",
      label: "混音技巧",
      author: "WOOWONJAE",
      published: "2024年1月20日",
      url: "/notes/fabfilter-pro-q3-tips",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    },
    {
      id: "post-2",
      title: "Logic Pro X 编曲工作流程优化",
      summary:
        "分享我在使用Logic Pro X进行音乐制作时的工作流程，包括模板设置、快捷键配置和插件管理等实用技巧。",
      label: "编曲制作",
      author: "WOOWONJAE",
      published: "2024年1月18日",
      url: "/notes/logic-pro-workflow",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80",
    },
    {
      id: "post-3",
      title: "现代流行音乐和声分析",
      summary:
        "通过分析当代流行歌曲的和声进行，学习现代音乐的和声语言，提升自己的编曲和作曲能力。",
      label: "音乐理论",
      author: "WOOWONJAE",
      published: "2024年1月16日",
      url: "/notes/modern-harmony-analysis",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    },
    {
      id: "post-4",
      title: "人声录音与处理技巧",
      summary:
        "从麦克风选择到后期处理，全面介绍人声录音的各个环节，让你的人声录音更加专业和动听。",
      label: "录音技术",
      author: "WOOWONJAE",
      published: "2024年1月14日",
      url: "/notes/vocal-recording-tips",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    },
    {
      id: "post-5",
      title: "电子音乐合成器编程基础",
      summary:
        "学习合成器的基本原理和编程方法，掌握创造独特音色的技巧，为你的电子音乐制作增添更多可能性。",
      label: "合成器",
      author: "WOOWONJAE",
      published: "2024年1月12日",
      url: "/notes/synthesizer-programming",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    },
    {
      id: "post-6",
      title: "音乐制作中的创意思维",
      summary:
        "探讨如何在音乐制作过程中保持创意思维，突破常规思路，创作出更有个性和感染力的音乐作品。",
      label: "创作心得",
      author: "WOOWONJAE",
      published: "2024年1月10日",
      url: "/notes/creative-thinking-in-music",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    },
  ],
};

export default function BlogCardsDemo() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* 背景动画 */}
      <HomeDottedSurface />

      <div className="relative z-10">
        {/* 页面标题 */}
        <Container className="pt-16 pb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              新卡片设计演示
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              基于 shadcn/ui 设计系统的现代化博客卡片风格，适用于音乐笔记展示
            </p>
          </div>
        </Container>

        {/* Blog7 组件演示 */}
        <Blog7 {...demoData} />

        {/* 设计说明 */}
        <Container className="pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">✨ 设计特点</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 现代化的卡片布局设计</li>
                  <li>• 16:9 比例的图片展示区域</li>
                  <li>• 清晰的信息层次结构</li>
                  <li>• 优雅的悬浮交互效果</li>
                  <li>• 响应式网格布局</li>
                </ul>
              </div>

              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">🎨 技术实现</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 基于 shadcn/ui 组件系统</li>
                  <li>• 使用 Tailwind CSS 样式</li>
                  <li>• Lucide React 图标库</li>
                  <li>• TypeScript 类型安全</li>
                  <li>• 完全可定制的设计</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
