import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE, clearAuthCookies } from "../../../../lib/auth";
import { logout } from "../../../../lib/auth/service";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await logout(refreshToken);
  }

  const response = NextResponse.json({ authenticated: false });
  clearAuthCookies(response);

  return response;
}
