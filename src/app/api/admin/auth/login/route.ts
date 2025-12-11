import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    // Find admin user
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .single();

    console.log("Login attempt:", { username, error, userFound: !!user });

    if (error || !user) {
      console.error("User not found or error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log("Password verification:", {
      isValidPassword,
      hashLength: user.password_hash?.length,
    });

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .setIssuedAt()
      .sign(JWT_SECRET);

    // Create response with HTTP-only cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
