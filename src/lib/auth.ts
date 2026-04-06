import { SignJWT, jwtVerify } from "jose";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "admin_token";
const EXPIRY = "8h";

export async function signJwt(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return compare(plain, hash);
}

export function getAdminToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    await verifyJwt(token);
    return true;
  } catch {
    return false;
  }
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
