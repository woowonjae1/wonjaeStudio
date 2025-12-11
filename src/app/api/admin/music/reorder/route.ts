import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function PUT(request: NextRequest) {
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
    const { tracks } = await request.json();

    if (!Array.isArray(tracks)) {
      return NextResponse.json(
        { error: "Invalid tracks data" },
        { status: 400 }
      );
    }

    // Update each track's display_order
    for (const track of tracks) {
      const { error } = await supabase
        .from("music_tracks")
        .update({ display_order: track.display_order })
        .eq("id", track.id);

      if (error) {
        console.error("Reorder error:", error);
        return NextResponse.json(
          { error: "Failed to reorder tracks" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
