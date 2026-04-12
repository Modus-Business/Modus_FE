import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "modus_access_token";
export const REFRESH_TOKEN_COOKIE = "modus_refresh_token";

export async function getStudentRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || "";
}

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

type AuthHandler<TData> = (context: {
  accessToken: string;
}) => Promise<ApiServiceResult<TData>>;

type AuthOptions<TData> = {
  successStatus?: number;
  mapData?: (data: TData) => unknown;
};

export async function withStudentAuth<TData>(
  handler: AuthHandler<TData>,
  options: AuthOptions<TData> = {},
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

export function studentLoggedOutResponse(clearCookies: (response: NextResponse) => void) {
  const response = NextResponse.json({ authenticated: false });
  clearCookies(response);
  return response;
}
