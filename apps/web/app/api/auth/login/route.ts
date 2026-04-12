import { NextResponse } from "next/server";

import { withJsonBody } from "../../../../lib/api/route";
import { getSessionFromAccessToken, setAuthCookies } from "../../../../lib/auth";
import { login, type LoginRequest, type LoginResponseData } from "../../../../lib/auth/service";

export function POST(request: Request) {
  return withJsonBody<LoginRequest, LoginResponseData>(request, login, {
    onSuccess: (data) => {
      const session = getSessionFromAccessToken(data.accessToken);

      if (!session.authenticated) {
        return NextResponse.json({ message: "로그인 응답을 해석하지 못했습니다." }, { status: 502 });
      }

      const response = NextResponse.json(session);
      setAuthCookies(response, data);

      return response;
    },
  });
}
