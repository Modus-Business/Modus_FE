import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

export function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) {
    const normalized = message.filter((entry): entry is string => typeof entry === "string");
    return normalized[0] ?? fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export async function postToBackend<TResponse>(
  path: string,
  body: unknown,
): Promise<BackendSuccess<TResponse> | BackendFailure> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      message: "인증 서버에 연결하지 못했습니다.",
      payload: null,
    };
  }

  const payload = (await response.json().catch(() => null)) as BackendEnvelope<TResponse> | null;

  if (!response.ok || !payload?.data) {
    return {
      ok: false,
      status: response.status,
      message: getErrorMessage(payload, "요청 처리에 실패했습니다."),
      payload,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload.data,
    payload,
  };
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
