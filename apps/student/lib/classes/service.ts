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

type ClassesServiceFailure = {
  ok: false;
  status: number;
  message: string;
};

type ClassesServiceSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type JoinClassRequest = {
  classCode: string;
};

export type JoinClassResponseData = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string;
  joinedAt: string;
};

export type ClassSummary = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string | null;
  studentCount: number | null;
  createdAt: string | null;
  myGroup: {
    groupId: string | null;
    name: string | null;
  } | null;
};

export type ClassesResponseData = {
  classes: ClassSummary[];
};

const studentClassesClient = axios.create({
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

export async function getClasses(
  accessToken: string,
): Promise<ClassesServiceSuccess<ClassesResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentClassesClient.get<BackendEnvelope<ClassesResponseData>>(
      "/classes",
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
        message: getErrorMessage(payload, "수업 목록을 불러오지 못했습니다."),
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
      message: "수업 목록 서버에 연결하지 못했습니다.",
    };
  }
}

export async function joinClass(
  accessToken: string,
  body: JoinClassRequest,
): Promise<ClassesServiceSuccess<JoinClassResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentClassesClient.post<BackendEnvelope<JoinClassResponseData>>(
      "/classes/join",
      body,
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
        message: getErrorMessage(payload, "수업 참여에 실패했습니다."),
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
      message: "수업 참여 서버에 연결하지 못했습니다.",
    };
  }
}
