import { remark } from "remark";
import remarkHtml from "remark-html";
import { unified } from "unified";

// Markdown 转 HTML 的处理器
const processor = remark().use(remarkHtml, { sanitize: false });

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await processor.process(markdown);
  return result.toString();
}

// 验证 frontmatter 必需字段
export function validateFrontmatter(data: any): {
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

// 验证日期格式
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// 格式化日期显示
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

// 生成文章摘要（如果没有提供）
export function generateSummary(
  content: string,
  maxLength: number = 150
): string {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗体标记
    .replace(/\*(.*?)\*/g, "$1") // 移除斜体标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接，保留文本
    .replace(/`([^`]+)`/g, "$1") // 移除行内代码标记
    .replace(/\n+/g, " ") // 将换行符替换为空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}
