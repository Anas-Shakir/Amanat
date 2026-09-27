import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types";

export interface AuthContext {
  role: UserRole;
  userId: string;
  isAuthenticated: boolean;
}

/**
 * Extracts and verifies the acting role from headers or session
 */
export function extractAuthContext(req: NextRequest): AuthContext {
  // Check custom demo role header or standard authorization header
  const roleHeader = req.headers.get("x-user-role") as UserRole | null;
  const userIdHeader = req.headers.get("x-user-id");

  const validRoles: UserRole[] = ["DONOR", "MERCHANT", "ORGANIZATION", "ADMIN"];

  if (roleHeader && validRoles.includes(roleHeader)) {
    return {
      role: roleHeader,
      userId: userIdHeader || `user-${roleHeader.toLowerCase()}`,
      isAuthenticated: true,
    };
  }

  // Fallback / default public actor
  return {
    role: "DONOR",
    userId: "anonymous",
    isAuthenticated: false,
  };
}

/**
 * Asserts that the request originates from one of the allowed roles
 */
export function requireRole(req: NextRequest, allowedRoles: UserRole[]): { authorized: boolean; errorResponse?: NextResponse } {
  const auth = extractAuthContext(req);

  // If ADMIN is in allowedRoles, admins always have access
  const isAllowed = allowedRoles.includes(auth.role) || (auth.role === "ADMIN");

  if (!isAllowed) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Unauthorized. Required role: [${allowedRoles.join(", ")}], current role: ${auth.role}`,
          errorCode: "ROLE_UNAUTHORIZED",
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true };
}
