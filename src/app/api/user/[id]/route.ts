import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  ApiError,
  isValidUUID,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/user/:id
 * 获取用户公开信息 (无需认证)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 验证 UUID 格式
    if (!isValidUUID(userId)) {
      throw new ApiError("VALIDATION_ERROR", "Invalid user ID format", 400);
    }

    Logger.info("Fetching public user profile", { userId });

    // 获取用户公开信息
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new ApiError("NOT_FOUND", "User not found", 404);
      }
      throw error;
    }

    // 获取用户的统计信息
    const { data: stats } = await supabase
      .from("profiles")
      .select(
        `
        id,
        follows!following_id(count),
        follows!follower_id(count)
      `
      )
      .eq("id", userId)
      .single();

    const followerCount =
      stats?.follows?.filter((f: any) => f.follower_id === userId).length || 0;
    const followingCount =
      stats?.follows?.filter((f: any) => f.following_id === userId).length || 0;

    // 获取用户的统计数据
    const [likesResult, commentsResult, favoritesResult] = await Promise.all([
      supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("user_id", userId),
      supabase
        .from("comments")
        .select("id", { count: "exact" })
        .eq("user_id", userId),
      supabase
        .from("favorites")
        .select("id", { count: "exact" })
        .eq("user_id", userId),
    ]);

    const userData = {
      ...user,
      stats: {
        followerCount,
        followingCount,
        likeCount: likesResult.count || 0,
        commentCount: commentsResult.count || 0,
        favoriteCount: favoritesResult.count || 0,
      },
    };

    Logger.info("User profile fetched successfully", { userId });
    return successResponse(userData);
  } catch (error) {
    Logger.error(
      "Failed to fetch user profile",
      error instanceof Error ? error : new Error(String(error))
    );
    return errorResponse(error);
  }
}
