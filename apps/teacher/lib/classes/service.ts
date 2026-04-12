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

export type CreateClassRequest = {
  name: string;
  description?: string;
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

export type CreateClassResponseData = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string;
  studentCount: number;
  createdAt: string;
};

const teacherClassesClient = axios.create({
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

export async function createClass(
  accessToken: string,
  body: CreateClassRequest,
): Promise<ClassesServiceSuccess<CreateClassResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherClassesClient.post<BackendEnvelope<CreateClassResponseData>>(
      "/classes",
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
        message: getErrorMessage(payload, "수업 생성에 실패했습니다."),
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
      message: "수업 생성 서버에 연결하지 못했습니다.",
    };
  }
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
    const response = await teacherClassesClient.get<BackendEnvelope<ClassesResponseData>>(
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
