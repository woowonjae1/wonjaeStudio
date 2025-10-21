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
 * GET /api/albums/:id
 * 获取单个专辑详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证 UUID
    if (!isValidUUID(id)) {
      throw new ApiError("INVALID_ID", "Invalid album ID", 400);
    }

    Logger.info("Fetching album detail", { albumId: id });

    const { data: album, error } = await supabase
      .from("albums")
      .select("*, tracks(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new ApiError("NOT_FOUND", "Album not found", 404);
      }
      Logger.error("Failed to fetch album", error);
      throw new ApiError("FETCH_ERROR", "Failed to fetch album", 500);
    }

    return successResponse(album);
  } catch (error) {
    Logger.error("GET /api/albums/:id error", error as Error);
    return errorResponse(error);
  }
}
