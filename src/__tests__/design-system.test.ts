/**
 * **Feature: music-notes-blog, Property 3: 样式系统一致性**
 *
 * 简化的样式系统测试：验证设计令牌和样式一致性
 */

import fs from "fs";
import path from "path";

describe("样式系统一致性", () => {
  test("全局样式文件存在性", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    expect(fs.existsSync(globalCssPath)).toBe(true);

    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");
    expect(globalCssContent).toContain("@tailwind base");
    expect(globalCssContent).toContain("@tailwind components");
    expect(globalCssContent).toContain("@tailwind utilities");
  });

  test("CSS 变量定义完整性", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查关键的 CSS 变量是否定义
    const requiredVariables = [
      "--background",
      "--foreground",
      "--blog-accent",
      "--blog-accent-light",
      "--content-width",
      "--section-spacing",
      "--element-spacing",
    ];

    requiredVariables.forEach((variable) => {
      expect(globalCssContent).toContain(variable);
    });
  });

  test("极简设计原则验证", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查圆角设置（应该很小）
    expect(globalCssContent).toContain("--radius: 0.25rem");

    // 检查内容宽度设置（应该在 60-80 字符范围）
    expect(globalCssContent).toContain("--content-width: 65ch");
    expect(globalCssContent).toContain("--content-width-wide: 80ch");

    // 检查动画时长设置（应该很短）
    expect(globalCssContent).toContain("animation-duration: 0.2s");
  });

  test("颜色系统一致性", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 验证颜色系统使用 HSL 格式
    const colorVariables = [
      "--background: 0 0% 100%",
      "--foreground: 0 0% 3.9%",
      "--blog-accent: 220 8.9% 46.1%",
      "--blog-accent-light: 220 14.3% 95.9%",
    ];

    colorVariables.forEach((colorVar) => {
      expect(globalCssContent).toContain(colorVar);
    });
  });

  test("组件样式类定义完整性", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 验证关键的组件样式类是否定义
    const requiredClasses = [
      ".blog-container",
      ".blog-content",
      ".blog-content-wide",
      ".blog-section",
      ".blog-element",
      ".btn",
      ".btn-primary",
      ".btn-secondary",
      ".card",
      ".tag",
    ];

    requiredClasses.forEach((className) => {
      expect(globalCssContent).toContain(className);
    });
  });

  test("响应式设计媒体查询", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查响应式断点
    expect(globalCssContent).toContain("@media (max-width: 768px)");
    expect(globalCssContent).toContain("@media (max-width: 480px)");
    expect(globalCssContent).toContain(
      "@media (prefers-reduced-motion: reduce)"
    );
  });

  test("Tailwind 配置一致性", () => {
    const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");
    expect(fs.existsSync(tailwindConfigPath)).toBe(true);

    const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf8");

    // 检查关键配置
    expect(tailwindConfigContent).toContain("content");
    expect(tailwindConfigContent).toContain(
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}"
    );
    expect(tailwindConfigContent).toContain("./content/**/*.{md,mdx}");

    // 检查极简设计相关配置
    expect(tailwindConfigContent).toContain("fontFamily");
    expect(tailwindConfigContent).toContain("maxWidth");
    expect(tailwindConfigContent).toContain("prose");
  });

  test("字体系统配置", () => {
    const globalCssPath = path.join(process.cwd(), "src/app/globals.css");
    const globalCssContent = fs.readFileSync(globalCssPath, "utf8");

    // 检查字体配置（不超过2种字体系列）
    expect(globalCssContent).toContain('font-family: "Inter"');
    expect(globalCssContent).toContain("-apple-system");
    expect(globalCssContent).toContain("BlinkMacSystemFont");

    // 检查字体优化设置
    expect(globalCssContent).toContain("-webkit-font-smoothing: antialiased");
    expect(globalCssContent).toContain("-moz-osx-font-smoothing: grayscale");
  });
});
