import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 错误信息映射表
const errorMessages: Record<string, string> = {
  "Invalid login credentials": "登录信息无效，请检查用户名和密码",
  "Email not confirmed": "邮箱未验证，请查看您的邮箱并点击验证链接",
  "User already registered": "用户已注册，请直接登录或尝试找回密码",
  "Password should be at least 6 characters": "密码长度至少为6个字符",
  "Email format is invalid": "邮箱格式无效，请输入正确的邮箱地址",
  "New password should be different from the old password": "新密码不能与旧密码相同",
  "Unable to validate email address: invalid format": "无法验证邮箱地址：格式无效",
  "For security purposes, you can only request this once every 60 seconds": "基于安全考虑，每60秒只能请求一次",
  "Email rate limit exceeded": "邮件发送频率超限，请稍后再试",
  "Rate limit exceeded": "请求频率过高，请稍后再试",
  "Failed to fetch": "网络连接失败，请检查您的网络连接",
  "Network Error": "网络错误，请检查您的网络连接",
  "User not found": "用户不存在",
  "error": "发生错误，请重试"
};

// 转换错误信息
export function translateError(errorMsg: string): string {
  // 检查是否有精确匹配
  const exactMatch = errorMessages[errorMsg];
  if (exactMatch) return exactMatch;
  
  // 检查部分匹配
  for (const key in errorMessages) {
    if (errorMsg.includes(key)) {
      return errorMessages[key];
    }
  }
  
  // 兜底错误信息
  return `操作失败: ${errorMsg}`;
}
