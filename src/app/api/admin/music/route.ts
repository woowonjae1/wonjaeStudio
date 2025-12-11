import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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
    const { data, error } = await supabase
      .from("music_tracks")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Music query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch tracks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tracks: data || [] });
  } catch (error) {
    console.error("Music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;
    const audioFile = formData.get("audio") as File | null;

    if (!title || !imageFile) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    // Upload image
    const imageExt = imageFile.name.split(".").pop();
    const imagePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExt}`;
    const imageBuffer = await imageFile.arrayBuffer();

    const { error: imageError } = await supabase.storage
      .from("music-covers")
      .upload(imagePath, imageBuffer, {
        contentType: imageFile.type,
      });

    if (imageError) {
      console.error("Image upload error:", imageError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const { data: imageUrlData } = supabase.storage
      .from("music-covers")
      .getPublicUrl(imagePath);

    // Upload audio if provided
    let audioUrl = null;
    if (audioFile) {
      const audioExt = audioFile.name.split(".").pop();
      const audioPath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${audioExt}`;
      const audioBuffer = await audioFile.arrayBuffer();

      const { error: audioError } = await supabase.storage
        .from("music-audio")
        .upload(audioPath, audioBuffer, {
          contentType: audioFile.type,
        });

      if (audioError) {
        console.error("Audio upload error:", audioError);
      } else {
        const { data: audioUrlData } = supabase.storage
          .from("music-audio")
          .getPublicUrl(audioPath);
        audioUrl = audioUrlData.publicUrl;
      }
    }

    // Get max display_order
    const { data: maxOrderData } = await supabase
      .from("music_tracks")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const newOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

    // Create track record
    const { data: track, error: insertError } = await supabase
      .from("music_tracks")
      .insert([
        {
          title,
          description,
          image_url: imageUrlData.publicUrl,
          audio_url: audioUrl,
          display_order: newOrder,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create track" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error("Create track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
