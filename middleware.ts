import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "admin_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-change-this-in-production"
);

// In-memory rate limit store for middleware (same process, lives across requests)
const rateStore = new Map<string, { count: number; resetAt: number }>();
function middlewareRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  if (entry.count > max) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // If user visits /admin/login while already logged in, redirect to /admin
  if (pathname === "/admin/login") {
    if (isValidSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin routes (except /admin/login)
  if (pathname.startsWith("/admin")) {
    if (!isValidSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate limit: cek-booking — max 10 lookup per 5 menit per IP
  if (pathname === "/cek-booking") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!middlewareRateLimit(`cek-booking:${ip}`, 10, 5 * 60_000)) {
      return new NextResponse("Terlalu banyak pencarian. Silakan coba lagi dalam beberapa menit.", {
        status: 429,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cek-booking"],
};
