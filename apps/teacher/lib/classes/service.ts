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

export type ClassParticipantGroup = {
  groupId: string | null;
  name: string | null;
};

export type ClassParticipantItem = {
  classParticipantId: string;
  studentId: string;
  studentName: string;
  email: string;
  nickname: string | null;
  group: ClassParticipantGroup | null;
  joinedAt: string;
  groupJoinedAt: string | null;
};

export type ClassParticipantsResponseData = {
  classId: string;
  className: string;
  participants: ClassParticipantItem[];
};

export type ClassGroupMemberSummary = {
  groupMemberId: string;
  classParticipantId: string;
  studentId: string;
  studentName: string;
  email: string;
  nickname: string | null;
  joinedAt: string;
};

export type ClassGroupSummary = {
  groupId: string;
  classId: string;
  name: string;
  memberCount: number;
  members: ClassGroupMemberSummary[];
  createdAt: string;
};

export type ClassGroupsResponseData = {
  groups: ClassGroupSummary[];
};

export type CreateClassResponseData = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string;
  studentCount: number;
  createdAt: string;
};

export type RegenerateClassCodeResponseData = {
  classId: string;
  classCode: string;
  updatedAt: string;
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

export async function regenerateClassCode(
  accessToken: string,
  classId: string,
): Promise<ClassesServiceSuccess<RegenerateClassCodeResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherClassesClient.patch<BackendEnvelope<RegenerateClassCodeResponseData>>(
      `/classes/${encodeURIComponent(classId)}/code`,
      undefined,
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
        message: getErrorMessage(payload, "수업 코드 재발급에 실패했습니다."),
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
      message: "수업 코드 재발급 서버에 연결하지 못했습니다.",
    };
  }
}

export async function getClassParticipants(
  accessToken: string,
  classId: string,
): Promise<ClassesServiceSuccess<ClassParticipantsResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherClassesClient.get<BackendEnvelope<ClassParticipantsResponseData>>(
      `/classes/${encodeURIComponent(classId)}/participants`,
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
        message: getErrorMessage(payload, "수업 참가 학생 목록을 불러오지 못했습니다."),
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
      message: "수업 참가 학생 서버에 연결하지 못했습니다.",
    };
  }
}

export async function getClassGroups(
  accessToken: string,
  classId: string,
): Promise<ClassesServiceSuccess<ClassGroupsResponseData> | ClassesServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherClassesClient.get<BackendEnvelope<ClassGroupsResponseData>>(
      `/classes/${encodeURIComponent(classId)}/groups`,
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
        message: getErrorMessage(payload, "수업 모둠 목록을 불러오지 못했습니다."),
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
      message: "수업 모둠 목록 서버에 연결하지 못했습니다.",
    };
  }
}
