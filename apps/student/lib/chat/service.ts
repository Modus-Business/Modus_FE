import "server-only";

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL || "";

type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

type ChatAdviceServiceFailure = {
  ok: false;
  status: number;
  message: string;
  raw: unknown;
};

type ChatAdviceServiceSuccess = {
  ok: true;
  status: number;
  data: unknown;
  raw: unknown;
};

export type ChatMessageAdviceRequest = {
  groupId: string;
  content: string;
};

export type ChatInterventionAdviceRequest = {
  groupId: string;
};

const studentChatServiceClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

function getErrorMessage(payload: unknown, fallback: string) {
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

function unwrapData(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  if ("data" in payload) {
    return (payload as BackendEnvelope<unknown>).data ?? null;
  }

  return payload;
}

export async function submitMessageAdvice(
  accessToken: string,
  body: ChatMessageAdviceRequest,
): Promise<ChatAdviceServiceSuccess | ChatAdviceServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
      raw: null,
    };
  }

  try {
    const response = await studentChatServiceClient.post<BackendEnvelope<unknown> | unknown>(
      "/chat/message-advice",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const payload = response.data ?? null;

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, "메시지 조언 조회에 실패했습니다."),
        raw: payload,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: unwrapData(payload),
      raw: payload,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "메시지 조언 서버에 연결하지 못했습니다.",
      raw: null,
    };
  }
}

export async function submitInterventionAdvice(
  accessToken: string,
  body: ChatInterventionAdviceRequest,
): Promise<ChatAdviceServiceSuccess | ChatAdviceServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
      raw: null,
    };
  }

  try {
    const response = await studentChatServiceClient.post<BackendEnvelope<unknown> | unknown>(
      "/chat/intervention-advice",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const payload = response.data ?? null;

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, "개입 조언 조회에 실패했습니다."),
        raw: payload,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: unwrapData(payload),
      raw: payload,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "개입 조언 서버에 연결하지 못했습니다.",
      raw: null,
    };
  }
}
