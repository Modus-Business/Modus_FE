import axios from "axios";

import { attachAuthRefreshInterceptor } from "../api/client";

export const studentChatApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachAuthRefreshInterceptor(studentChatApiClient);
