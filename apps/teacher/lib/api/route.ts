import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "modus_access_token";
export const REFRESH_TOKEN_COOKIE = "modus_refresh_token";

type ApiServiceResult<TData> =
  | {
      ok: true;
      status: number;
      data: TData;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

type AuthJsonHandler<TBody, TData> = (context: {
  accessToken: string;
  body: TBody;
}) => Promise<ApiServiceResult<TData>>;

type AuthJsonOptions<TData> = {
  successStatus?: number;
  mapData?: (data: TData) => unknown;
};

type AuthHandler<TData> = (context: {
  accessToken: string;
}) => Promise<ApiServiceResult<TData>>;

export async function withTeacherAuthJson<TBody, TData>(
  request: Request,
  handler: AuthJsonHandler<TBody, TData>,
  options: AuthJsonOptions<TData> = {},
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = (await request.json().catch(() => null)) as TBody | null;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const result = await handler({ accessToken, body });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const responseBody = options.mapData ? options.mapData(result.data) : result.data;

  return NextResponse.json(responseBody, { status: options.successStatus || result.status });
}

export async function withTeacherAuth<TData>(
  handler: AuthHandler<TData>,
  options: AuthJsonOptions<TData> = {},
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  const result = await handler({ accessToken });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const responseBody = options.mapData ? options.mapData(result.data) : result.data;

  return NextResponse.json(responseBody, { status: options.successStatus || result.status });
}

export async function getTeacherRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || "";
}

export function teacherLoggedOutResponse(clearCookies: (response: NextResponse) => void) {
  const response = NextResponse.json({ authenticated: false });
  clearCookies(response);
  return response;
}
