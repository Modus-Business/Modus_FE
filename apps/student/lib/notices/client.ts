import axios from "axios";

import { attachAuthRefreshInterceptor } from "../api/client";

export const studentNoticesApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachAuthRefreshInterceptor(studentNoticesApiClient);
