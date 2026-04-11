import "server-only";

import { NextResponse } from "next/server";
import { createBackendServerClient } from "@modus/api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;
const backendClient = API_BASE_URL ? createBackendServerClient({ baseURL: API_BASE_URL }) : null;

export const ACCESS_TOKEN_COOKIE = "modus_access_token";
export const REFRESH_TOKEN_COOKIE = "modus_refresh_token";

export async function logoutFromBackend(refreshToken: string) {
  if (!backendClient) {
    return;
  }

  try {
    await backendClient.post("/auth/logout", { refreshToken });
  } catch {
    // Local logout should still clear cookies even if token revocation fails.
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}
