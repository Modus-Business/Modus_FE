import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE, clearAuthCookies, getSessionFromAccessToken, setAuthCookies } from "../../../../lib/auth";
import { refresh } from "../../../../lib/auth/service";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "리프레시 토큰이 없습니다." }, { status: 401 });
  }

  const result = await refresh(refreshToken);

  if (!result.ok) {
    const response = NextResponse.json({ message: result.message }, { status: result.status });
    clearAuthCookies(response);
    return response;
  }

  const session = getSessionFromAccessToken(result.data.accessToken);

  if (!session.authenticated) {
    const response = NextResponse.json({ message: "재발급 응답을 해석하지 못했습니다." }, { status: 502 });
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json(session);
  setAuthCookies(response, result.data);

  return response;
}
