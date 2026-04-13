import "server-only";

import { getAuthCookieDomain } from "@modus/classroom-ui/auth";
import { getApiBaseUrl } from "@modus/classroom-ui/env";
import axios from "axios";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../api/route";

const API_BASE_URL = getApiBaseUrl();

type JwtPayload = {
  email?: string;
  role?: string;
  exp?: number;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthRole = "student" | "teacher";

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

type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

type RefreshResponseData = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  email: string;
};

const teacherAuthClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

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

export function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  const domain = getAuthCookieDomain();
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    ...(domain ? { domain } : {}),
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
  const domain = getAuthCookieDomain();
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    ...(domain ? { domain } : {}),
    maxAge: 0,
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", cookieOptions);
}

export async function refreshBackendTokens(refreshToken: string) {
  if (!API_BASE_URL) {
    return {
      ok: false as const,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherAuthClient.post<BackendEnvelope<RefreshResponseData>>(
      "/auth/login/refresh",
      { refreshToken },
    );
    const payload = response.data || null;

    if (response.status < 200 || response.status >= 300 || !payload?.data) {
      return {
        ok: false as const,
        status: response.status,
        message: "토큰 재발급에 실패했습니다.",
      };
    }

    return {
      ok: true as const,
      status: response.status,
      data: payload.data,
    };
  } catch {
    return {
      ok: false as const,
      status: 502,
      message: "토큰 재발급 서버에 연결하지 못했습니다.",
    };
  }
}
