import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getRequestBody,
  ApiError,
  getPaginationParams,
  getOffset,
  formatPaginatedResponse,
} from "@/lib/api-utils";
import {
  CommentSchema,
  UpdateCommentSchema,
  validateSchema,
} from "@/lib/validators";
import { Logger } from "@/lib/logger";

/**
 * GET /api/comments
 * 获取评论列表
 */
export async function GET(request: NextRequest) {
  try {
    const itemType = request.nextUrl.searchParams.get("item_type");
    const itemId = request.nextUrl.searchParams.get("item_id");

    if (!itemType || !itemId) {
      throw new ApiError(
        "MISSING_PARAMS",
        "item_type and item_id are required",
        400
      );
    }

    Logger.info("Fetching comments", { itemType, itemId });

    const { page = 1, limit = 20 } = getPaginationParams(request);
    const offset = getOffset(page, limit);

    // 获取总数
    const { count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .is("parent_id", null); // 仅获取顶级评论

    // 获取数据
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*, profiles(display_name, avatar_url)")
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      Logger.error("Failed to fetch comments", error);
      throw new ApiError("FETCH_ERROR", "Failed to fetch comments", 500);
    }

    const total = count || 0;
    const formatted = formatPaginatedResponse(
      comments || [],
      total,
      page,
      limit
    );

    return successResponse(formatted);
  } catch (error) {
    Logger.error("GET /api/comments error", error as Error);
    return errorResponse(error);
  }
}

/**
 * POST /api/comments
 * 发表评论
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await getRequestBody(request);

    // 验证输入
    const { data: validated, error: validationError } = validateSchema(
      CommentSchema,
      body
    );
    if (validationError) {
      throw new ApiError("VALIDATION_ERROR", validationError, 400);
    }

    if (!validated) {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body", 400);
    }

    Logger.info("Creating comment", {
      userId: user.id,
      itemType: validated.item_type,
    });

    // 创建评论
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        content: validated.content,
        item_type: validated.item_type,
        item_id: validated.item_id,
        parent_id: validated.parent_id,
      })
      .select("*, profiles(display_name, avatar_url)")
      .single();

    if (error) {
      Logger.error("Failed to create comment", error);
      throw new ApiError("CREATE_ERROR", "Failed to create comment", 500);
    }

    Logger.info("Comment created successfully", { userId: user.id });
    return successResponse(comment, 201);
  } catch (error) {
    Logger.error("POST /api/comments error", error as Error);
    return errorResponse(error);
  }
}
