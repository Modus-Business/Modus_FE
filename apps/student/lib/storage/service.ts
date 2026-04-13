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

type StorageServiceFailure = {
  ok: false;
  status: number;
  message: string;
};

type StorageServiceSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type CreatePresignedUploadUrlRequest = {
  fileName: string;
  contentType: string;
  purpose?: "assignments" | "images" | "general";
};

export type CreatePresignedUploadUrlResponseData = {
  fileKey: string;
  fileUrl: string;
  uploadUrl: string;
  expiresInSeconds: number;
};

const studentStorageClient = axios.create({
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

export async function createPresignedUploadUrl(
  accessToken: string,
  body: CreatePresignedUploadUrlRequest,
): Promise<StorageServiceSuccess<CreatePresignedUploadUrlResponseData> | StorageServiceFailure> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      status: 500,
      message: "API 주소가 설정되지 않았습니다.",
    };
  }

  try {
    const response = await studentStorageClient.post<BackendEnvelope<CreatePresignedUploadUrlResponseData>>(
      "/storage/presigned-upload-url",
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
        message: getErrorMessage(payload, "업로드 URL 발급에 실패했습니다."),
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
      message: "업로드 URL 서버에 연결하지 못했습니다.",
    };
  }
}

export async function uploadFileToStorage(
  uploadUrl: string,
  fileBuffer: ArrayBuffer,
  contentType: string,
): Promise<StorageServiceSuccess<null> | StorageServiceFailure> {
  try {
    const response = await axios.put(uploadUrl, fileBuffer, {
      headers: {
        "Content-Type": contentType,
      },
      validateStatus: () => true,
      maxBodyLength: Infinity,
    });

    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        status: response.status,
        message: "파일 업로드에 실패했습니다.",
      };
    }

    return {
      ok: true,
      status: response.status,
      data: null,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "파일 업로드 서버에 연결하지 못했습니다.",
    };
  }
}
