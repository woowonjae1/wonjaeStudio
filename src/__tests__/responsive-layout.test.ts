/**
 * **Feature: music-notes-blog, Property 2: 响应式布局完整性**
 *
 * 简化的响应式布局测试：验证布局在不同设备尺寸下的表现
 */

import fs from "fs";
import path from "path";

describe("响应式布局完整性", () => {
  test("媒体查询断点定义", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查关键的响应式断点
    const breakpoints = [
      "@media (max-width: 768px)",
      "@media (max-width: 480px)",
      "@media (prefers-reduced-motion: reduce)",
    ];

    breakpoints.forEach((breakpoint) => {
      expect(globalCssContent).toContain(breakpoint);
    });
  });

  test("单栏布局容器配置", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查容器类定义
    expect(globalCssContent).toContain(".blog-container");
    expect(globalCssContent).toContain(".blog-content");
    expect(globalCssContent).toContain(".blog-content-wide");

    // 检查最大宽度设置
    expect(globalCssContent).toContain("max-w-4xl");
    expect(globalCssContent).toContain("mx-auto");
    expect(globalCssContent).toContain("px-6");
  });

  test("内容宽度限制（60-80字符）", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查内容宽度变量
    expect(globalCssContent).toContain("--content-width: 65ch");
    expect(globalCssContent).toContain("--content-width-wide: 80ch");

    // 检查 Tailwind 配置中的 prose 宽度
    const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");
    const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf8");

    expect(tailwindConfigContent).toContain("'prose': '65ch'");
    expect(tailwindConfigContent).toContain("'prose-wide': '80ch'");
  });

  test("移动端字体大小优化", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查移动端字体大小设置
    expect(globalCssContent).toContain("font-size: 16px"); // 768px 断点
    expect(globalCssContent).toContain("font-size: 15px"); // 480px 断点

    // 检查文本大小调整防护
    expect(globalCssContent).toContain("-webkit-text-size-adjust: 100%");
    expect(globalCssContent).toContain("text-size-adjust: 100%");
  });

  test("水平滚动防护", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查水平滚动防护
    expect(globalCssContent).toContain("overflow-x: hidden");
    expect(globalCssContent).toContain("position: relative");
  });

  test("触摸滚动优化", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查 iOS 触摸滚动优化
    expect(globalCssContent).toContain("-webkit-overflow-scrolling: touch");
  });

  test("UI 组件响应式支持", () => {
    // 检查 UI 组件是否支持响应式
    const buttonPath = path.join(process.cwd(), "src/components/ui/Button.tsx");
    const buttonContent = fs.readFileSync(buttonPath, "utf8");

    // 检查按钮组件有不同尺寸选项
    expect(buttonContent).toContain("size?: 'sm' | 'md' | 'lg'");
    expect(buttonContent).toContain("px-3 py-1.5 text-sm"); // sm
    expect(buttonContent).toContain("px-4 py-2 text-sm"); // md
    expect(buttonContent).toContain("px-6 py-3 text-base"); // lg

    // 检查容器组件有不同尺寸选项
    const containerPath = path.join(
      process.cwd(),
      "src/components/ui/Container.tsx"
    );
    const containerContent = fs.readFileSync(containerPath, "utf8");

    expect(containerContent).toContain("size?: 'default' | 'content' | 'wide'");
    expect(containerContent).toContain("blog-container");
    expect(containerContent).toContain("blog-content");
    expect(containerContent).toContain("blog-content-wide");
  });

  test("极简设计的视觉元素最小化", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查阴影使用最小化
    expect(globalCssContent).toContain("shadow-sm");
    expect(globalCssContent).toContain("hover:shadow-md");

    // 检查边框使用最小化
    expect(globalCssContent).toContain("border-transparent");

    // 检查圆角最小化
    expect(globalCssContent).toContain("--radius: 0.25rem");
  });

  test("间距系统一致性", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查间距变量定义
    expect(globalCssContent).toContain("--section-spacing: 4rem");
    expect(globalCssContent).toContain("--element-spacing: 1.5rem");

    // 检查间距类定义
    expect(globalCssContent).toContain(".blog-section");
    expect(globalCssContent).toContain(".blog-element");
    expect(globalCssContent).toContain("margin-bottom: var(--section-spacing)");
    expect(globalCssContent).toContain("margin-bottom: var(--element-spacing)");
  });
});
