import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface AdminUser {
  userId: number;
  username: string;
}

export async function verifyAdminToken(
  request: NextRequest
): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Middleware wrapper for protected API routes
export function withAdminAuth(
  handler: (
    request: NextRequest,
    user: AdminUser
  ) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const user = await verifyAdminToken(request);

    if (!user) {
      return unauthorizedResponse();
    }

    return handler(request, user);
  };
}
