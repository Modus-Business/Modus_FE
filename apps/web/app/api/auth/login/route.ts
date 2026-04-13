import { NextResponse } from "next/server";
import { buildAuthNavigationPlan } from "@modus/classroom-ui/auth";

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

      const navigationPlan = buildAuthNavigationPlan({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        requestUrl: request.url,
        role: session.user.role,
      });

      if (!navigationPlan.ok) {
        return NextResponse.json({ message: navigationPlan.message }, { status: 500 });
      }

      const response = NextResponse.json({
        ...session,
        ...(navigationPlan.plan.mode === "handoff"
          ? {
              authTransfer: {
                endpoint: navigationPlan.plan.endpoint,
                token: navigationPlan.plan.token,
              },
            }
          : {}),
      });

      if (navigationPlan.plan.mode === "direct") {
        setAuthCookies(response, data);
      }

      return response;
    },
  });
}
