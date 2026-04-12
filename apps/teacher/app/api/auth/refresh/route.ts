import { NextResponse } from "next/server";

import { getTeacherRefreshToken } from "../../../../lib/api/route";
import { clearAuthCookies, getSessionFromAccessToken, refreshBackendTokens, setAuthCookies } from "../../../../lib/auth/session";

function clearAuthError(message: string, status: number) {
  const response = NextResponse.json({ message }, { status });
  clearAuthCookies(response);
  return response;
}

export async function POST() {
  const refreshToken = await getTeacherRefreshToken();

  if (!refreshToken) {
    return clearAuthError("리프레시 토큰이 없습니다.", 401);
  }

  const result = await refreshBackendTokens(refreshToken);

  if (!result.ok) {
    return clearAuthError(result.message, result.status);
  }

  const session = getSessionFromAccessToken(result.data.accessToken);

  if (!session.authenticated) {
    return clearAuthError("재발급 응답을 해석하지 못했습니다.", 502);
  }

  const response = NextResponse.json(session);
  setAuthCookies(response, result.data);

  return response;
}
