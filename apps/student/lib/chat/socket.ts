"use client";

import { getApiBaseUrl } from "@modus/classroom-ui/env";
import { io } from "socket.io-client";

const API_BASE_URL = getApiBaseUrl();

export function createChatSocket(token: string) {
  if (!API_BASE_URL) {
    throw new Error("채팅 서버 주소가 설정되지 않았습니다.");
  }

  return io(`${API_BASE_URL}/chat`, {
    auth: {
      token,
    },
    autoConnect: false,
    transports: ["websocket"],
  });
}
