import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
  getOffset,
  formatPaginatedResponse,
  ApiError,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/albums
 * 获取专辑列表
 */
export async function GET(request: NextRequest) {
  try {
    Logger.info("Fetching albums list");

    const { page = 1, limit = 10 } = getPaginationParams(request);
    const offset = getOffset(page, limit);

    // 获取总数
    const { count } = await supabase
      .from("albums")
      .select("*", { count: "exact", head: true });

    // 获取数据
    const { data: albums, error } = await supabase
      .from("albums")
      .select("*, tracks(id, title, duration)")
      .order("release_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      Logger.error("Failed to fetch albums", error);
      throw new ApiError("FETCH_ERROR", "Failed to fetch albums", 500);
    }

    const total = count || 0;
    const formatted = formatPaginatedResponse(albums || [], total, page, limit);

    return successResponse(formatted);
  } catch (error) {
    Logger.error("GET /api/albums error", error as Error);
    return errorResponse(error);
  }
}
