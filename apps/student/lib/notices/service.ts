import "server-only";

import { getApiBaseUrl } from "@modus/classroom-ui/env";
import axios from "axios";

const API_BASE_URL = getApiBaseUrl();

type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

type NoticesServiceFailure = {
  ok: false;
  status: number;
  message: string;
};

type NoticesServiceSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type NoticeItemResponseData = {
  noticeId: string;
  classId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type NoticeListResponseData = {
  notices: NoticeItemResponseData[];
};

const studentNoticesClient = axios.create({
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

export async function getNoticesByClass(
  accessToken: string,
  classId: string,
): Promise<NoticesServiceSuccess<NoticeListResponseData> | NoticesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentNoticesClient.get<BackendEnvelope<NoticeListResponseData>>(
      `/notices/class/${encodeURIComponent(classId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const payload = response.data || null;

    if (response.status < 200 || response.status >= 300 || !payload?.data) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, "공지 목록을 불러오지 못했습니다."),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: payload.data,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "공지 목록 서버에 연결하지 못했습니다.",
    };
  }
}
