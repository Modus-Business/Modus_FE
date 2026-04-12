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

type GroupsServiceFailure = {
  ok: false;
  status: number;
  message: string;
};

type GroupsServiceSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type GroupDetailMember = {
  groupMemberId: string;
  displayName: string;
  isMe: boolean;
};

export type GroupDetailResponseData = {
  groupId: string;
  classId: string;
  name: string;
  memberCount: number;
  members: GroupDetailMember[];
};

export type CreateGroupRequest = {
  classId: string;
  name: string;
  studentIds?: string[];
};

export type CreateGroupResponseData = {
  groupId: string;
  classId: string;
  name: string;
  memberCount: number;
  createdAt: string;
};

export type UpdateGroupRequest = {
  name: string;
  studentIds?: string[];
};

export type DeleteGroupResponseData = {
  message: string;
};

const teacherGroupsClient = axios.create({
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

export async function getGroupDetail(
  accessToken: string,
  groupId: string,
): Promise<GroupsServiceSuccess<GroupDetailResponseData> | GroupsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherGroupsClient.get<BackendEnvelope<GroupDetailResponseData>>(
      `/groups/${encodeURIComponent(groupId)}`,
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
        message: getErrorMessage(payload, "모둠 정보를 불러오지 못했습니다."),
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
      message: "모둠 조회 서버에 연결하지 못했습니다.",
    };
  }
}

export async function deleteGroup(
  accessToken: string,
  groupId: string,
): Promise<GroupsServiceSuccess<DeleteGroupResponseData> | GroupsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherGroupsClient.delete<BackendEnvelope<DeleteGroupResponseData>>(
      `/groups/${encodeURIComponent(groupId)}`,
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
        message: getErrorMessage(payload, "모둠 삭제에 실패했습니다."),
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
      message: "모둠 삭제 서버에 연결하지 못했습니다.",
    };
  }
}

export async function createGroup(
  accessToken: string,
  body: CreateGroupRequest,
): Promise<GroupsServiceSuccess<CreateGroupResponseData> | GroupsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherGroupsClient.post<BackendEnvelope<CreateGroupResponseData>>(
      "/groups",
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
        message: getErrorMessage(payload, "모둠 생성에 실패했습니다."),
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
      message: "모둠 생성 서버에 연결하지 못했습니다.",
    };
  }
}

export async function updateGroup(
  accessToken: string,
  groupId: string,
  body: UpdateGroupRequest,
): Promise<GroupsServiceSuccess<CreateGroupResponseData> | GroupsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherGroupsClient.patch<BackendEnvelope<CreateGroupResponseData>>(
      `/groups/${encodeURIComponent(groupId)}`,
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
        message: getErrorMessage(payload, "모둠 수정에 실패했습니다."),
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
      message: "모둠 수정 서버에 연결하지 못했습니다.",
    };
  }
}
