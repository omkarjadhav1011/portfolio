import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const isLoginPage = pathname === "/admin/login";
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Try to verify JWT
  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, secret);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // Already logged in → redirect away from login page
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Not logged in → redirect to login page
  if (!isLoginPage && !isValid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
