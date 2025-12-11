import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return unauthorizedResponse();
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const trackId = parseInt(id);

    if (isNaN(trackId)) {
      return NextResponse.json({ error: "Invalid track ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;
    const audioFile = formData.get("audio") as File | null;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title) updates.title = title;
    if (description !== null) updates.description = description;

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const imageExt = imageFile.name.split(".").pop();
      const imagePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExt}`;
      const imageBuffer = await imageFile.arrayBuffer();

      const { error: imageError } = await supabase.storage
        .from("music-covers")
        .upload(imagePath, imageBuffer, {
          contentType: imageFile.type,
        });

      if (!imageError) {
        const { data: imageUrlData } = supabase.storage
          .from("music-covers")
          .getPublicUrl(imagePath);
        updates.image_url = imageUrlData.publicUrl;
      }
    }

    // Upload new audio if provided
    if (audioFile && audioFile.size > 0) {
      const audioExt = audioFile.name.split(".").pop();
      const audioPath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${audioExt}`;
      const audioBuffer = await audioFile.arrayBuffer();

      const { error: audioError } = await supabase.storage
        .from("music-audio")
        .upload(audioPath, audioBuffer, {
          contentType: audioFile.type,
        });

      if (!audioError) {
        const { data: audioUrlData } = supabase.storage
          .from("music-audio")
          .getPublicUrl(audioPath);
        updates.audio_url = audioUrlData.publicUrl;
      }
    }

    const { data: track, error } = await supabase
      .from("music_tracks")
      .update(updates)
      .eq("id", trackId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update track" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error("Update track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return unauthorizedResponse();
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const trackId = parseInt(id);

    if (isNaN(trackId)) {
      return NextResponse.json({ error: "Invalid track ID" }, { status: 400 });
    }

    // Get track to delete associated files
    const { data: track } = await supabase
      .from("music_tracks")
      .select("image_url, audio_url")
      .eq("id", trackId)
      .single();

    // Delete track record
    const { error } = await supabase
      .from("music_tracks")
      .delete()
      .eq("id", trackId);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete track" },
        { status: 500 }
      );
    }

    // Try to delete storage files (non-blocking)
    if (track?.image_url) {
      const imagePath = track.image_url.split("/").pop();
      if (imagePath) {
        supabase.storage.from("music-covers").remove([imagePath]);
      }
    }
    if (track?.audio_url) {
      const audioPath = track.audio_url.split("/").pop();
      if (audioPath) {
        supabase.storage.from("music-audio").remove([audioPath]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
