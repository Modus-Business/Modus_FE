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

export type SubmitAssignmentRequest = {
  groupId: string;
  fileUrl?: string;
  link?: string;
};

export type AssignmentSubmissionItemData = {
  submissionId: string;
  groupId: string;
  fileUrl: string | null;
  link: string | null;
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
};

const studentAssignmentsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

const studentSubmissionFileClient = axios.create({
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

export async function submitAssignment(
  accessToken: string,
  body: SubmitAssignmentRequest,
): Promise<AssignmentsServiceSuccess<AssignmentSubmissionItemData> | AssignmentsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentAssignmentsClient.post<BackendEnvelope<AssignmentSubmissionItemData>>(
      "/assignments/submissions",
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
        message: getErrorMessage(payload, "과제 제출에 실패했습니다."),
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
      message: "과제 제출 서버에 연결하지 못했습니다.",
    };
  }
}

export async function getMySubmission(
  accessToken: string,
  groupId: string,
): Promise<AssignmentsServiceSuccess<AssignmentSubmissionItemData | null> | AssignmentsServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentAssignmentsClient.get<BackendEnvelope<AssignmentSubmissionItemData | null>>(
      `/assignments/submissions/my/${encodeURIComponent(groupId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const payload = response.data || null;

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, "제출 정보를 불러오지 못했습니다."),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: payload ? payload.data || null : null,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "제출 정보 서버에 연결하지 못했습니다.",
    };
  }
}

export async function fetchSubmissionFile(
  accessToken: string,
  submissionId: string,
): Promise<AssignmentsServiceSuccess<SubmissionFileResponseData> | AssignmentsServiceFailure> {
  try {
    const response = await studentSubmissionFileClient.get<ArrayBuffer>(
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
