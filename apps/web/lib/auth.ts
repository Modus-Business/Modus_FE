import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiClientError, createBackendServerClient, extractApiMessage } from "@modus/api-client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASEURL ??
  process.env.API_BASE_URL ??
  "http://52.78.206.38";
export const ACCESS_TOKEN_COOKIE = "modus_access_token";
export const REFRESH_TOKEN_COOKIE = "modus_refresh_token";

export type AuthRole = "student" | "teacher";

type JwtPayload = {
  email?: string;
  role?: string;
  exp?: number;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

type BackendFailure = {
  ok: false;
  status: number;
  message: string;
  payload: BackendEnvelope<unknown> | null;
};

type BackendSuccess<T> = {
  ok: true;
  status: number;
  data: T;
  payload: BackendEnvelope<T> | null;
};

export type SessionPayload =
  | {
      authenticated: false;
      user?: undefined;
    }
  | {
      authenticated: true;
      user: {
        email: string;
        role: AuthRole;
      };
    };

function isAuthRole(value: unknown): value is AuthRole {
  return value === "student" || value === "teacher";
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string): Date | undefined {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return undefined;
  }

  return new Date(payload.exp * 1000);
}

export function getSessionFromAccessToken(accessToken?: string | null): SessionPayload {
  if (!accessToken) {
    return { authenticated: false };
  }

  const payload = decodeJwtPayload(accessToken);

  if (!payload?.email || !isAuthRole(payload.role)) {
    return { authenticated: false };
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: {
      email: payload.email,
      role: payload.role,
    },
  };
}

export async function getSessionFromCookies(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  return getSessionFromAccessToken(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value);
}

const backendClient = createBackendServerClient({ baseURL: API_BASE_URL });

export async function postToBackend<TResponse>(
  path: string,
  body: unknown,
): Promise<BackendSuccess<TResponse> | BackendFailure> {
  try {
    const response = await backendClient.post<BackendEnvelope<TResponse>>(path, body);

    if (!response.data?.data) {
      return {
        ok: false,
        status: response.status,
        message: "요청 처리에 실패했습니다.",
        payload: response.data ?? null,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: response.data.data,
      payload: response.data,
    };
  } catch (error) {
    if (!(error instanceof ApiClientError)) {
      return {
        ok: false,
        status: 502,
        message: "인증 서버에 연결하지 못했습니다.",
        payload: null,
      };
    }

    const payload = error.payload as BackendEnvelope<unknown> | null | undefined;

    return {
      ok: false,
      status: error.status,
      message: extractApiMessage(payload, error.message),
      payload: payload ?? null,
    };
  }
}

export function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseOptions,
    expires: getTokenExpiry(tokens.accessToken),
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseOptions,
    expires: getTokenExpiry(tokens.refreshToken),
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}
