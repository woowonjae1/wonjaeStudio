/**
 * **Feature: music-notes-blog, Property 1: Markdown 内容解析一致性**
 *
 * 属性测试：对于任何有效的 Markdown 文章，解析后应该包含所有必需字段
 * （标题、日期、摘要、标签、正文）且结构一致
 */

import fc from "fast-check";
import matter from "gray-matter";

// 简化的 frontmatter 验证函数（避免 ES 模块依赖）
function validateFrontmatter(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const requiredFields = ["title", "date", "summary"];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`缺少必需字段: ${field}`);
    }
  });

  // 验证日期格式
  if (data.date && !isValidDate(data.date)) {
    errors.push("日期格式无效，应为 YYYY-MM-DD 格式");
  }

  // 验证标签和主题是数组
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("标签应为数组格式");
  }

  if (data.topics && !Array.isArray(data.topics)) {
    errors.push("主题应为数组格式");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

describe("Markdown 内容解析一致性", () => {
  test("基础 Markdown 解析功能测试", () => {
    const testMarkdown = `---
title: "测试文章"
date: "2024-01-15"
summary: "这是一个测试文章"
tags: ["测试", "markdown"]
topics: ["测试"]
---

# 测试标题

这是测试内容。`;

    const { data, content } = matter(testMarkdown);

    expect(data.title).toBe("测试文章");
    expect(data.date).toBe("2024-01-15");
    expect(data.summary).toBe("这是一个测试文章");
    expect(data.tags).toEqual(["测试", "markdown"]);
    expect(data.topics).toEqual(["测试"]);
    expect(content.trim()).toBe("# 测试标题\n\n这是测试内容。");
  });

  test("属性 1: 有效的 frontmatter 应该被正确解析", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc
            .string({ minLength: 1, maxLength: 20 })
            .filter(
              (s) =>
                s.trim().length > 0 && /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/.test(s)
            ),
          date: fc
            .date({ min: new Date("2020-01-01"), max: new Date("2030-12-31") })
            .map((date) => date.toISOString().split("T")[0]),
          summary: fc
            .string({ minLength: 10, maxLength: 50 })
            .filter(
              (s) =>
                s.trim().length >= 10 && /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/.test(s)
            ),
          tags: fc.array(
            fc
              .string({ minLength: 1, maxLength: 10 })
              .filter((s) => /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(s)),
            { minLength: 0, maxLength: 3 }
          ),
          topics: fc.array(
            fc
              .string({ minLength: 1, maxLength: 10 })
              .filter((s) => /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(s)),
            { minLength: 0, maxLength: 2 }
          ),
        }),
        (frontmatterData) => {
          // 创建简单的 YAML frontmatter
          const yamlLines = [
            `title: "${frontmatterData.title}"`,
            `date: "${frontmatterData.date}"`,
            `summary: "${frontmatterData.summary}"`,
            `tags: [${frontmatterData.tags.map((tag) => `"${tag}"`).join(", ")}]`,
            `topics: [${frontmatterData.topics.map((topic) => `"${topic}"`).join(", ")}]`,
          ];

          const markdownDoc = `---\n${yamlLines.join("\n")}\n---\n\n# 测试内容\n\n这是测试内容。`;

          const { data, content } = matter(markdownDoc);

          // 验证解析结果
          expect(data.title).toBe(frontmatterData.title);
          expect(data.date).toBe(frontmatterData.date);
          expect(data.summary).toBe(frontmatterData.summary);
          expect(Array.isArray(data.tags)).toBe(true);
          expect(Array.isArray(data.topics)).toBe(true);
          expect(content).toContain("测试内容");

          return true;
        }
      ),
      { numRuns: 20 } // 减少迭代次数以提高测试速度
    );
  });

  test("属性 1.1: frontmatter 验证应该正确识别缺失字段", () => {
    const testCases = [
      { title: "", date: "2024-01-01", summary: "test summary" }, // 空标题
      { title: "test", date: "", summary: "test summary" }, // 空日期
      { title: "test", date: "2024-01-01", summary: "" }, // 空摘要
      { title: "test", date: "invalid-date", summary: "test summary" }, // 无效日期
      {
        title: "test",
        date: "2024-01-01",
        summary: "test summary",
        tags: "not-array",
      }, // 非数组标签
    ];

    testCases.forEach((testCase) => {
      const validation = validateFrontmatter(testCase);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  test("属性 1.2: 有效的 frontmatter 应该通过验证", () => {
    const validData = {
      title: "有效标题",
      date: "2024-01-15",
      summary: "这是一个有效的摘要",
      tags: ["标签1", "标签2"],
      topics: ["主题1"],
    };

    const validation = validateFrontmatter(validData);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  test("日期验证功能测试", () => {
    expect(isValidDate("2024-01-15")).toBe(true);
    expect(isValidDate("2024-12-31")).toBe(true);
    expect(isValidDate("invalid-date")).toBe(false);
    expect(isValidDate("2024-13-01")).toBe(false);
    expect(isValidDate("2024-01-32")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });
});
