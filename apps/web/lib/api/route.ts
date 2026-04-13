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

type JsonHandler<TBody, TData> = (
  body: TBody,
) => Promise<ApiServiceResult<TData>>;

type JsonOptions<TData> = {
  successStatus?: number;
  mapData?: (data: TData) => unknown;
  onSuccess?: (data: TData) => NextResponse | null;
  onFailure?: (
    result: Extract<ApiServiceResult<TData>, { ok: false }>,
  ) => NextResponse | null;
};

export async function withJsonBody<TBody, TData>(
  request: Request,
  handler: JsonHandler<TBody, TData>,
  options: JsonOptions<TData> = {},
) {
  const body = (await request.json().catch(() => null)) as TBody | null;

  if (!body) {
    return NextResponse.json(
      { message: "잘못된 요청 본문입니다." },
      { status: 400 },
    );
  }

  const result = await handler(body);

  if (!result.ok) {
    const customResponse = options.onFailure?.(result);

    if (customResponse) {
      return customResponse;
    }

    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  const customResponse = options.onSuccess?.(result.data);

  if (customResponse) {
    return customResponse;
  }

  const responseBody = options.mapData
    ? options.mapData(result.data)
    : result.data;

  return NextResponse.json(responseBody, {
    status: options.successStatus || result.status,
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || "";
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || "";
}

export function jsonMessage(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}
