import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE, clearAuthCookies, postToBackend } from "../../../../lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await postToBackend("/auth/logout", { refreshToken });
  }

  const response = NextResponse.json({ authenticated: false });
  clearAuthCookies(response);

  return response;
}
