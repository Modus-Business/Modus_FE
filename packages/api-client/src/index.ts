import axios, { AxiosError, AxiosHeaders, type AxiosInstance } from "axios";

type MessagePayload = {
  message?: string | string[];
};

type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string | string[];
};

type AccessTokenGetter = () => string | undefined | Promise<string | undefined>;

export class ApiClientError<TPayload = unknown> extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: TPayload,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function extractApiMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const message = (payload as MessagePayload).message;

  if (Array.isArray(message)) {
    const normalized = message.filter((entry): entry is string => typeof entry === "string");
    return normalized[0] ?? fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

function normalizeAxiosError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return new ApiClientError(fallback, 500);
  }

  const payload = error.response?.data;
  const status = error.response?.status ?? 500;
  return new ApiClientError(extractApiMessage(payload, fallback), status, payload);
}

function withJsonDefaults(client: AxiosInstance) {
  client.interceptors.request.use(async (config) => {
    config.headers = config.headers ?? new AxiosHeaders();

    if (config.data !== undefined && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  });

  return client;
}

export function createBackendServerClient(options: {
  baseURL: string;
  getAccessToken?: AccessTokenGetter;
}) {
  const client = withJsonDefaults(
    axios.create({
      baseURL: options.baseURL,
    }),
  );

  client.interceptors.request.use(async (config) => {
    const accessToken = await options.getAccessToken?.();

    if (accessToken) {
      config.headers = config.headers ?? new AxiosHeaders();
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeAxiosError(error, "요청 처리에 실패했습니다.")),
  );

  return client;
}

export function createAppBrowserClient(options?: { baseURL?: string }) {
  const client = withJsonDefaults(
    axios.create({
      baseURL: options?.baseURL,
      withCredentials: true,
    }),
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeAxiosError(error, "요청 처리에 실패했습니다.")),
  );

  return client;
}

export function getBackendEnvelopeData<T>(payload: BackendEnvelope<T> | undefined | null) {
  return payload?.data;
}
