import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getRequestBody,
  ApiError,
} from "@/lib/api-utils";
import { LikeSchema, validateSchema } from "@/lib/validators";
import { Logger } from "@/lib/logger";

/**
 * POST /api/favorites
 * 收藏/取消收藏内容
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await getRequestBody(request);

    // 验证输入
    const { data: validated, error: validationError } = validateSchema(
      LikeSchema,
      body
    );
    if (validationError) {
      throw new ApiError("VALIDATION_ERROR", validationError, 400);
    }

    if (!validated) {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body", 400);
    }

    const { item_type, item_id } = validated;

    Logger.info("Toggling favorite", {
      userId: user.id,
      itemType: item_type,
      itemId: item_id,
    });

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", item_type)
      .eq("item_id", item_id)
      .single();

    if (existing) {
      // 取消收藏
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (error) {
        Logger.error("Failed to remove favorite", error);
        throw new ApiError("DELETE_ERROR", "Failed to remove favorite", 500);
      }

      Logger.info("Favorite removed", { userId: user.id });
      return successResponse({ favorited: false });
    } else {
      // 添加收藏
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        item_type,
        item_id,
      });

      if (error) {
        Logger.error("Failed to add favorite", error);
        throw new ApiError("CREATE_ERROR", "Failed to add favorite", 500);
      }

      Logger.info("Favorite added", { userId: user.id });
      return successResponse({ favorited: true }, 201);
    }
  } catch (error) {
    Logger.error("POST /api/favorites error", error as Error);
    return errorResponse(error);
  }
}

/**
 * GET /api/favorites
 * 获取用户的收藏列表
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    Logger.info("Fetching favorites", { userId: user.id });

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Logger.error("Failed to fetch favorites", error);
      throw new ApiError("FETCH_ERROR", "Failed to fetch favorites", 500);
    }

    return successResponse(favorites || []);
  } catch (error) {
    Logger.error("GET /api/favorites error", error as Error);
    return errorResponse(error);
  }
}
