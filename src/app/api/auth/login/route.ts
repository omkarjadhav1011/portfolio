import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signJwt, comparePassword } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { username, password } = parsed.data;

    if (
      username !== process.env.ADMIN_USERNAME ||
      !(await comparePassword(password, process.env.ADMIN_PASSWORD_HASH!))
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJwt({ sub: username });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
