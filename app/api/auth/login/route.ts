import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientId } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: max 5 login attempts per 15 menit per IP
    const clientId = getClientId(request);
    const rate = checkRateLimit(`login:${clientId}`, 5, 15 * 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan login. Silakan coba lagi nanti." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
        },
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Format input tidak valid" }, { status: 400 });
    }

    if (email.length > 255 || password.length > 128) {
      return NextResponse.json({ error: "Email atau password terlalu panjang" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Email atau password tidak sesuai" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password tidak sesuai" }, { status: 401 });
    }

    const token = await createToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({ success: true, message: "Login berhasil" });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat login" }, { status: 500 });
  }
}
