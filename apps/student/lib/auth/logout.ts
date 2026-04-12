import "server-only";

import axios from "axios";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../api/route";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL || "";

const studentAuthClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function logoutFromBackend(refreshToken: string) {
  if (!API_BASE_URL) {
    return;
  }

  try {
    await studentAuthClient.post(
      "/auth/logout",
      { refreshToken },
      {
        validateStatus: () => true,
      },
    );
  } catch {
    // 로컬 세션 정리가 우선이므로 백엔드 로그아웃 실패는 삼킨다.
  }
}

export function clearAuthCookies(response: NextResponse) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", cookieOptions);
}
