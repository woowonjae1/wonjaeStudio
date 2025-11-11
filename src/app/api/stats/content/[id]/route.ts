import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  ApiError,
  isValidUUID,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/stats/content/[id]
 * 获取内容统计信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      throw new ApiError("INVALID_ID", "Invalid content ID", 400);
    }

    Logger.info("Fetching content stats", { contentId: id });

    // 获取点赞数
    const { count: likeCount } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("item_id", id);

    // 获取评论数
    const { count: commentCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("item_id", id);

    // 获取收藏数
    const { count: favoriteCount } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("item_id", id);

    const stats = {
      likeCount: likeCount || 0,
      commentCount: commentCount || 0,
      favoriteCount: favoriteCount || 0,
    };

    Logger.info("Content stats retrieved", { contentId: id, stats });

    return successResponse(stats);
  } catch (error) {
    Logger.error("GET /api/stats/content error", error as Error);
    return errorResponse(error);
  }
}
