import { NextResponse } from "next/server";

import { getRefreshToken, jsonMessage } from "../../../../lib/api/route";
import { clearAuthCookies, getSessionFromAccessToken, setAuthCookies } from "../../../../lib/auth";
import { refresh, type LoginResponseData } from "../../../../lib/auth/service";

function clearAuthError(message: string, status: number) {
  const response = NextResponse.json({ message }, { status });
  clearAuthCookies(response);
  return response;
}

function refreshSuccess(data: LoginResponseData) {
  const session = getSessionFromAccessToken(data.accessToken);

  if (!session.authenticated) {
    return clearAuthError("재발급 응답을 해석하지 못했습니다.", 502);
  }

  const response = NextResponse.json(session);
  setAuthCookies(response, data);

  return response;
}

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return jsonMessage("리프레시 토큰이 없습니다.", 401);
  }

  const result = await refresh(refreshToken);

  if (!result.ok) {
    return clearAuthError(result.message, result.status);
  }

  return refreshSuccess(result.data);
}
