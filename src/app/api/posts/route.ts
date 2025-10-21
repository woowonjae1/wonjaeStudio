import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
  getOffset,
  formatPaginatedResponse,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/posts
 * 获取文章列表 (分页)
 */
export async function GET(request: NextRequest) {
  try {
    const { page = 1, limit = 10 } = getPaginationParams(request);
    const offset = getOffset(page, limit);

    const category = request.nextUrl.searchParams.get("category");
    const author = request.nextUrl.searchParams.get("author");

    Logger.info("Fetching posts", { page, limit, category, author });

    // 获取总数
    let countQuery = supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (category) {
      countQuery = countQuery.eq("category", category);
    }
    if (author) {
      countQuery = countQuery.eq("user_id", author);
    }

    const { count } = await countQuery;

    // 获取数据
    let query = supabase
      .from("posts")
      .select("*, profiles(display_name, avatar_url)")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }
    if (author) {
      query = query.eq("user_id", author);
    }

    const { data: posts, error } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) {
      throw error;
    }

    Logger.info("Posts fetched successfully", { count, page, limit });

    const formatted = formatPaginatedResponse(
      posts || [],
      count || 0,
      page,
      limit
    );
    return successResponse(formatted);
  } catch (error) {
    Logger.error(
      "Failed to fetch posts",
      error instanceof Error ? error : new Error(String(error))
    );
    return errorResponse(error);
  }
}
