import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
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

    // Transform data to match frontend format
    const tracks = (data || []).map((track: any) => ({
      title: track.title,
      description: track.description,
      imageSrc: track.image_url,
      audioSrc: track.audio_url || "",
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
