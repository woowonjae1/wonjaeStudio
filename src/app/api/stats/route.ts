import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  requireAuth,
  ApiError,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/stats
 * 获取用户统计信息
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const userId = request.nextUrl.searchParams.get("user_id") || user.id;

    // 如果查询的不是自己，则使用公开统计
    const isOwnStats = userId === user.id;

    Logger.info("Fetching user stats", { userId });

    // 获取粉丝数
    const { count: followerCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

    // 获取关注数
    const { count: followingCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    // 获取收藏数
    const { count: favoriteCount } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // 获取评论数
    const { count: commentCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // 获取播放历史
    const { count: playCount } = await supabase
      .from("play_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const stats = {
      followerCount: followerCount || 0,
      followingCount: followingCount || 0,
      favoriteCount: favoriteCount || 0,
      commentCount: commentCount || 0,
      playCount: playCount || 0,
    };

    Logger.info("User stats retrieved", { userId, stats });

    return successResponse(stats);
  } catch (error) {
    Logger.error("GET /api/stats error", error as Error);
    return errorResponse(error);
  }
}
