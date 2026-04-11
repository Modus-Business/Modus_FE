import { ApiClientError, createBackendServerClient } from "@modus/api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;
export const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB;
export const ACCESS_TOKEN_COOKIE = "modus_access_token";

type MyGroupDto = {
  groupId: string | null;
  name: string | null;
};

export type ClassSummaryDto = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string | null;
  studentCount: number | null;
  createdAt: string | null;
  myGroup: MyGroupDto | null;
};

type GetClassesSuccessResponseDto = {
  success: boolean;
  statusCode: number;
  data: {
    classes: ClassSummaryDto[];
  };
};

export class ClassesApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ClassesApiError";
  }
}

export async function fetchClasses(accessToken?: string) {
  if (!accessToken) {
    throw new ClassesApiError("인증 토큰이 필요합니다.", 401);
  }

  if (!API_BASE_URL) {
    throw new ClassesApiError("API 주소가 설정되지 않았습니다.", 500);
  }

  try {
    const client = createBackendServerClient({
      baseURL: API_BASE_URL,
      getAccessToken: () => accessToken,
    });
    const response = await client.get<GetClassesSuccessResponseDto>("/classes");
    return response.data.data.classes;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClassesApiError(error.message, error.status);
    }

    throw new ClassesApiError("수업 목록을 불러오지 못했습니다.", 502);
  }
}
