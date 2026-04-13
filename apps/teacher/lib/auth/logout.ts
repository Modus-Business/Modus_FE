import "server-only";

import { getApiBaseUrl } from "@modus/classroom-ui/env";
import axios from "axios";

import { clearAuthCookies } from "./session";

export const API_BASE_URL = getApiBaseUrl();

const teacherAuthClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function logoutFromBackend(refreshToken: string) {
  if (!API_BASE_URL) {
    return;
  }

  try {
    await teacherAuthClient.post(
      "/auth/logout",
      { refreshToken },
      {
        validateStatus: () => true,
      },
    );
  } catch {
    // 로컬 세션 정리가 우선이므로 백엔드 로그아웃 실패는 삼킨다.
  }
}

export { clearAuthCookies };
