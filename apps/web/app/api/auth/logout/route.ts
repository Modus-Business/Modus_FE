import { NextResponse } from "next/server";

import { getRefreshToken } from "../../../../lib/api/route";
import { clearAuthCookies } from "../../../../lib/auth";
import { logout } from "../../../../lib/auth/service";

function loggedOutResponse() {
  const response = NextResponse.json({ authenticated: false });
  clearAuthCookies(response);
  return response;
}

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await logout(refreshToken);
  }

  return loggedOutResponse();
}
