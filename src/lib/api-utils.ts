import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * 标准 API 响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400
  ) {
    super(message);
  }
}

/**
 * 成功响应
 */
export function successResponse<T>(
  data: T,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * 错误响应
 */
export function errorResponse(
  error: unknown,
  defaultStatus = 400
): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status }
    );
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: defaultStatus }
  );
}

/**
 * 验证认证 Token
 */
export async function requireAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(
        "UNAUTHORIZED",
        "Missing or invalid Authorization header",
        401
      );
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new ApiError("UNAUTHORIZED", "Invalid or expired token", 401);
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNAUTHORIZED", "Authentication failed", 401);
  }
}

/**
 * 验证用户权限
 */
export async function checkPermission(
  userId: string,
  itemType: string,
  itemId: string,
  permission: string
) {
  // 简单的权限检查示例
  // 可根据实际需求扩展

  if (permission === "edit") {
    // 检查是否是所有者
    const { data, error } = await supabase
      .from(itemType + "s") // albums, posts 等
      .select("id")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new ApiError(
        "FORBIDDEN",
        "You do not have permission to edit this item",
        403
      );
    }
  }

  if (permission === "delete") {
    // 检查是否是所有者
    const { data, error } = await supabase
      .from(itemType + "s")
      .select("id")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new ApiError(
        "FORBIDDEN",
        "You do not have permission to delete this item",
        403
      );
    }
  }
}

/**
 * 包装 API 处理程序
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[API Error]", error);
      return errorResponse(error);
    }
  };
}

/**
 * 分页辅助函数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100); // 最多 100

  if (page < 1) throw new ApiError("INVALID_PARAMS", "Page must be >= 1");
  if (limit < 1) throw new ApiError("INVALID_PARAMS", "Limit must be >= 1");

  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
  };
}

/**
 * 获取分页偏移量
 */
export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * 格式化分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function formatPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

/**
 * 验证 UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 获取查询参数
 */
export function getQueryParam(
  request: NextRequest,
  key: string,
  defaultValue?: string
): string | undefined {
  return request.nextUrl.searchParams.get(key) || defaultValue;
}

/**
 * 获取 JSON 请求体
 */
export async function getRequestBody<T = any>(
  request: NextRequest
): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new ApiError("INVALID_JSON", "Request body is not valid JSON", 400);
  }
}
