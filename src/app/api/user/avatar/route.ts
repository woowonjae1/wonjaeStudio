import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  ApiError,
  requireAuth,
  getRequestBody,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * POST /api/user/avatar
 * 上传用户头像
 */
export async function POST(request: NextRequest) {
  try {
    // 验证认证
    const user = await requireAuth(request);

    Logger.info("Uploading user avatar", { userId: user.id });

    // 获取请求体
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new ApiError("VALIDATION_ERROR", "File is required", 400);
    }

    // 验证文件类型
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "Invalid file type. Allowed: JPEG, PNG, WebP, GIF",
        400
      );
    }

    // 验证文件大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "File size must be less than 5MB",
        400
      );
    }

    // 生成文件名
    const timestamp = Date.now();
    const fileName = `${user.id}/${timestamp}-${file.name}`;
    const bucketName = "avatars";

    // 上传到 Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (uploadError) {
      Logger.error("Storage upload failed", uploadError);
      throw new ApiError("UPLOAD_ERROR", "Failed to upload file", 500);
    }

    // 获取公开 URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    // 更新用户头像 URL
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      Logger.error("Profile update failed", updateError);
      throw new ApiError("UPDATE_ERROR", "Failed to update profile", 500);
    }

    Logger.info("Avatar uploaded successfully", {
      userId: user.id,
      fileSize: file.size,
    });

    return successResponse({
      avatar_url: publicUrl,
      user: updated,
    });
  } catch (error) {
    Logger.error(
      "Failed to upload avatar",
      error instanceof Error ? error : new Error(String(error))
    );
    return errorResponse(error);
  }
}
