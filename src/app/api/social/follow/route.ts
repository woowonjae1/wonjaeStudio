import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getRequestBody,
  ApiError,
} from "@/lib/api-utils";
import { FollowSchema, validateSchema } from "@/lib/validators";
import { Logger } from "@/lib/logger";

/**
 * POST /api/social/follow
 * 关注一个用户
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await getRequestBody(request);

    // 验证输入
    const { data: validated, error: validationError } = validateSchema(
      FollowSchema,
      body
    );
    if (validationError) {
      throw new ApiError("VALIDATION_ERROR", validationError, 400);
    }

    if (!validated) {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body", 400);
    }

    const { following_id } = validated;

    // 不能关注自己
    if (user.id === following_id) {
      throw new ApiError("INVALID_ACTION", "Cannot follow yourself", 400);
    }

    Logger.info("Following user", {
      userId: user.id,
      followingId: following_id,
    });

    // 检查是否已关注
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", following_id)
      .single();

    if (existing) {
      throw new ApiError(
        "ALREADY_FOLLOWING",
        "Already following this user",
        400
      );
    }

    // 创建关注关系
    const { data: follow, error } = await supabase
      .from("follows")
      .insert({
        follower_id: user.id,
        following_id: following_id,
      })
      .select()
      .single();

    if (error) {
      Logger.error("Failed to follow user", error);
      throw new ApiError("CREATE_ERROR", "Failed to follow user", 500);
    }

    Logger.info("User followed successfully", {
      userId: user.id,
      followingId: following_id,
    });
    return successResponse({ success: true, data: follow }, 201);
  } catch (error) {
    Logger.error("POST /api/social/follow error", error as Error);
    return errorResponse(error);
  }
}

/**
 * DELETE /api/social/follow/:id
 * 取消关注一个用户
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const followingId = request.nextUrl.searchParams.get("following_id");

    if (!followingId) {
      throw new ApiError("MISSING_PARAM", "following_id is required", 400);
    }

    Logger.info("Unfollowing user", { userId: user.id, followingId });

    // 删除关注关系
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", followingId);

    if (error) {
      Logger.error("Failed to unfollow user", error);
      throw new ApiError("DELETE_ERROR", "Failed to unfollow user", 500);
    }

    Logger.info("User unfollowed successfully", {
      userId: user.id,
      followingId,
    });
    return successResponse({ success: true });
  } catch (error) {
    Logger.error("DELETE /api/social/follow error", error as Error);
    return errorResponse(error);
  }
}
