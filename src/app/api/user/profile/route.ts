import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getRequestBody,
  ApiError,
} from "@/lib/api-utils";
import { UpdateUserProfileSchema, validateSchema } from "@/lib/validators";
import { Logger } from "@/lib/logger";

/**
 * GET /api/user/profile
 * 获取当前用户的个人资料
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    Logger.info("Fetching user profile", { userId: user.id });

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      Logger.error("Failed to fetch profile", error);
      throw new ApiError("FETCH_ERROR", "Failed to fetch user profile", 500);
    }

    if (!profile) {
      throw new ApiError("NOT_FOUND", "User profile not found", 404);
    }

    return successResponse(profile);
  } catch (error) {
    Logger.error("GET /api/user/profile error", error as Error);
    return errorResponse(error);
  }
}

/**
 * PUT /api/user/profile
 * 更新当前用户的个人资料
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    Logger.info("Updating user profile", { userId: user.id });

    const body = await getRequestBody(request);

    // 验证输入
    const { data: validated, error: validationError } = validateSchema(
      UpdateUserProfileSchema,
      body
    );
    if (validationError) {
      throw new ApiError("VALIDATION_ERROR", validationError, 400);
    }

    // 更新数据库
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      Logger.error("Failed to update profile", error);
      throw new ApiError("UPDATE_ERROR", "Failed to update user profile", 500);
    }

    Logger.info("Profile updated successfully", { userId: user.id });
    return successResponse(updated);
  } catch (error) {
    Logger.error("PUT /api/user/profile error", error as Error);
    return errorResponse(error);
  }
}
