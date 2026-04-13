import { openAuthHandoff } from "@modus/classroom-ui/auth";
import { NextResponse } from "next/server";

import { clearAuthCookies, setAuthCookies } from "../../../../lib/auth/session";

function buildFallbackUrl(request: Request) {
  const webBaseUrl = process.env.NEXT_PUBLIC_WEB?.trim();

  if (!webBaseUrl) {
    return new URL("/", request.url);
  }

  return new URL("/auth", webBaseUrl.endsWith("/") ? webBaseUrl : `${webBaseUrl}/`);
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const token = formData?.get("token");

  if (typeof token !== "string" || !token) {
    return NextResponse.redirect(buildFallbackUrl(request), { status: 303 });
  }

  try {
    const payload = openAuthHandoff(token);

    if (payload.role !== "teacher") {
      throw new Error("교강사 로그인 handoff가 아닙니다.");
    }

    const destination = payload.returnTo.startsWith("/") ? payload.returnTo : "/";
    const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
    setAuthCookies(response, {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });

    return response;
  } catch {
    const response = NextResponse.redirect(buildFallbackUrl(request), { status: 303 });
    clearAuthCookies(response);
    return response;
  }
}
