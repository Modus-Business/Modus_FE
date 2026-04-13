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

type AssignmentsServiceFailure = {
  ok: false;
  status: number;
  message: string;
};

type AssignmentsServiceSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

type SubmissionFileResponseData = {
  body: ArrayBuffer;
  contentDisposition: string;
  contentLength: string;
  contentType: string;
};

export type AssignmentSubmissionStatus = {
  groupId: string;
  groupName: string;
  isSubmitted: boolean;
  submissionId: string | null;
  fileUrl: string | null;
  link: string | null;
  submittedAt: string | null;
};

export type AssignmentSubmissionStatusListResponseData = {
  submissions: AssignmentSubmissionStatus[];
};

const teacherAssignmentsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

const teacherSubmissionFileClient = axios.create({
  responseType: "arraybuffer",
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

export async function getClassSubmissionStatuses(
  accessToken: string,
  classId: string,
): Promise<AssignmentsServiceSuccess<AssignmentSubmissionStatusListResponseData> | AssignmentsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await teacherAssignmentsClient.get<BackendEnvelope<AssignmentSubmissionStatusListResponseData>>(
      `/assignments/submissions/class/${encodeURIComponent(classId)}`,
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
        message: getErrorMessage(payload, "제출 현황을 불러오지 못했습니다."),
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
      message: "제출 현황 서버에 연결하지 못했습니다.",
    };
  }
}

export async function fetchSubmissionFile(
  accessToken: string,
  submissionId: string,
): Promise<AssignmentsServiceSuccess<SubmissionFileResponseData> | AssignmentsServiceFailure> {
  try {
    const response = await teacherSubmissionFileClient.get<ArrayBuffer>(
      `/assignments/submissions/${encodeURIComponent(submissionId)}/download`,
      {
        baseURL: API_BASE_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const contentType = typeof response.headers["content-type"] === "string" ? response.headers["content-type"] : "";
    const contentDisposition = typeof response.headers["content-disposition"] === "string" ? response.headers["content-disposition"] : "";
    const contentLength = typeof response.headers["content-length"] === "string" ? response.headers["content-length"] : "";

    if (response.status < 200 || response.status >= 300 || !response.data) {
      return {
        ok: false,
        status: response.status >= 400 ? response.status : 502,
        message: "제출 파일을 불러오지 못했습니다.",
      };
    }

    return {
      ok: true,
      status: response.status,
      data: {
        body: response.data,
        contentType,
        contentDisposition,
        contentLength,
      },
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "제출 파일 서버에 연결하지 못했습니다.",
    };
  }
}
