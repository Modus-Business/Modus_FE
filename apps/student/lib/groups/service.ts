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

const studentGroupsClient = axios.create({
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
    const response = await studentGroupsClient.get<BackendEnvelope<GroupDetailResponseData>>(
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
