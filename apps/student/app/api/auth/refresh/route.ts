import { NextResponse } from "next/server";

import { getStudentRefreshToken } from "../../../../lib/api/route";
import { clearAuthCookies, refreshBackendTokens, setAuthCookies } from "../../../../lib/auth/session";

function clearAuthError(message: string, status: number) {
  const response = NextResponse.json({ message }, { status });
  clearAuthCookies(response);
  return response;
}

export async function POST() {
  const refreshToken = await getStudentRefreshToken();

  if (!refreshToken) {
    return clearAuthError("리프레시 토큰이 없습니다.", 401);
  }

  const result = await refreshBackendTokens(refreshToken);

  if (!result.ok) {
    return clearAuthError(result.message, result.status);
  }

  const response = NextResponse.json({ authenticated: true });
  setAuthCookies(response, result.data);

  return response;
}
