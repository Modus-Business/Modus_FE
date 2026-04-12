import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "modus_access_token";
export const REFRESH_TOKEN_COOKIE = "modus_refresh_token";

export async function getStudentRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || "";
}

export function studentLoggedOutResponse(clearCookies: (response: NextResponse) => void) {
  const response = NextResponse.json({ authenticated: false });
  clearCookies(response);
  return response;
}
