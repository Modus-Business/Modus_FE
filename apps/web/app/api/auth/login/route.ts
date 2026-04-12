import { NextResponse } from "next/server";

import { getSessionFromAccessToken, setAuthCookies } from "../../../../lib/auth";
import { login, type LoginRequest } from "../../../../lib/auth/service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginRequest | null;

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const result = await login(body);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const session = getSessionFromAccessToken(result.data.accessToken);

  if (!session.authenticated) {
    return NextResponse.json({ message: "로그인 응답을 해석하지 못했습니다." }, { status: 502 });
  }

  const response = NextResponse.json(session);
  setAuthCookies(response, result.data);

  return response;
}
