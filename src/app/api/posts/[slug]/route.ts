import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { successResponse, errorResponse, ApiError } from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/posts/:slug
 * 获取单篇文章详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug || slug.length === 0) {
      throw new ApiError("VALIDATION_ERROR", "Slug is required", 400);
    }

    Logger.info("Fetching post by slug", { slug });

    // 获取文章详情
    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles(id, display_name, avatar_url),
        comments(id, content, user_id, created_at, profiles(display_name, avatar_url))
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new ApiError("NOT_FOUND", "Post not found", 404);
      }
      throw error;
    }

    // 获取统计信息
    const [likesResult, commentsResult, favoritesResult] = await Promise.all([
      supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("item_id", post.id)
        .eq("item_type", "post"),
      supabase
        .from("comments")
        .select("id", { count: "exact" })
        .eq("item_id", post.id)
        .eq("item_type", "post"),
      supabase
        .from("favorites")
        .select("id", { count: "exact" })
        .eq("item_id", post.id)
        .eq("item_type", "post"),
    ]);

    const postData = {
      ...post,
      stats: {
        likeCount: likesResult.count || 0,
        commentCount: commentsResult.count || 0,
        favoriteCount: favoritesResult.count || 0,
      },
    };

    Logger.info("Post fetched successfully", { slug });
    return successResponse(postData);
  } catch (error) {
    Logger.error(
      "Failed to fetch post",
      error instanceof Error ? error : new Error(String(error))
    );
    return errorResponse(error);
  }
}
