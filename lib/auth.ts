import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "admin_token";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-change-this-in-production"
);

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign a new JWT token with admin payload
 */
export async function createToken(payload: AdminJwtPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET);
}

/**
 * Verify an existing JWT token
 */
export async function verifyToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session payload from httpOnly cookie (Server Side)
 */
export async function getSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

/**
 * Get current admin data from database based on active session
 */
export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session?.id) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return admin;
  } catch {
    return null;
  }
}
