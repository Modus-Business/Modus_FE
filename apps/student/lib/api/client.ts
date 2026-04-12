import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  __authRetry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

async function refreshSession() {
  await axios.post("/api/auth/refresh", undefined, {
    withCredentials: true,
  });
}

export function attachAuthRefreshInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const responseStatus = error.response?.status;
      const originalRequest = error.config as RetriableRequestConfig | undefined;

      if (responseStatus !== 401 || !originalRequest || originalRequest.__authRetry) {
        throw error;
      }

      originalRequest.__authRetry = true;

      refreshPromise ||= refreshSession().finally(() => {
        refreshPromise = null;
      });

      await refreshPromise;

      return client(originalRequest);
    },
  );
}
