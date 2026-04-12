import "server-only";

import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASEURL || "";

export type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

export type BackendFailure = {
  ok: false;
  status: number;
  message: string;
  payload: BackendEnvelope<unknown> | null;
};

export type BackendSuccess<T> = {
  ok: true;
  status: number;
  data: T;
  payload: BackendEnvelope<T> | null;
};

export const backendAuthClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) {
    const normalized = message.filter((entry): entry is string => typeof entry === "string");
    return normalized[0] || fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export async function postAuth<TResponse>(
  path: string,
  body: unknown,
): Promise<BackendSuccess<TResponse> | BackendFailure> {
  try {
    const response = await backendAuthClient.post<BackendEnvelope<TResponse>>(path, body);
    const payload = response.data || null;

    if (response.status < 200 || response.status >= 300 || !payload?.data) {
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
  } catch {
    return {
      ok: false,
      status: 502,
      message: "인증 서버에 연결하지 못했습니다.",
      payload: null,
    };
  }
}
