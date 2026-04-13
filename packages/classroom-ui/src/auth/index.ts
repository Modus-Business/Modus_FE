import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type SharedAuthRole = "student" | "teacher";

type AuthHandoffPayload = {
  accessToken: string;
  refreshToken: string;
  returnTo: string;
  role: SharedAuthRole;
  issuedAt: number;
  expiresAt: number;
};

type AuthTransferPayload = {
  endpoint: string;
  token: string;
};

type AuthNavigationPlan =
  | {
      mode: "direct";
      destination: string;
    }
  | ({
      mode: "handoff";
      destination: string;
    } & AuthTransferPayload);

const HANDOFF_TTL_MS = 5 * 60 * 1000;
const ALGORITHM = "aes-256-gcm";

function getAuthHandoffSecret() {
  return process.env.AUTH_HANDOFF_SECRET?.trim() || "";
}

function getAuthDestinationForRole(role: SharedAuthRole) {
  const value = role === "student" ? process.env.NEXT_PUBLIC_STUDENT : process.env.NEXT_PUBLIC_TEACHER;
  return value?.trim() || "";
}

function getEncryptionKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}

function parseDestination(destination: string) {
  try {
    return new URL(destination);
  } catch {
    return null;
  }
}

function base64UrlEncode(value: Buffer) {
  return value.toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url");
}

function buildReturnTo(url: URL) {
  const value = `${url.pathname}${url.search}`;
  return value || "/";
}

export function getAuthCookieDomain() {
  const value = process.env.AUTH_COOKIE_DOMAIN?.trim();
  return value || undefined;
}

export function buildAuthNavigationPlan(input: {
  accessToken: string;
  refreshToken: string;
  requestUrl: string;
  role: SharedAuthRole;
}): { ok: true; plan: AuthNavigationPlan } | { ok: false; message: string } {
  const destination = getAuthDestinationForRole(input.role);

  if (!destination) {
    return {
      ok: false,
      message:
        input.role === "student" ? "학생 서비스 주소가 설정되지 않았습니다." : "교강사 서비스 주소가 설정되지 않았습니다.",
    };
  }

  const destinationUrl = parseDestination(destination);

  if (!destinationUrl) {
    return {
      ok: false,
      message: "로그인 이동 주소 형식이 올바르지 않습니다.",
    };
  }

  const requestUrl = new URL(input.requestUrl);
  const cookieDomain = getAuthCookieDomain();

  if (cookieDomain || destinationUrl.hostname === requestUrl.hostname) {
    return {
      ok: true,
      plan: {
        mode: "direct",
        destination,
      },
    };
  }

  const secret = getAuthHandoffSecret();

  if (!secret) {
    return {
      ok: false,
      message: "AUTH_HANDOFF_SECRET 환경변수가 설정되지 않았습니다.",
    };
  }

  const token = sealAuthHandoff({
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    returnTo: buildReturnTo(destinationUrl),
    role: input.role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + HANDOFF_TTL_MS,
  });

  return {
    ok: true,
    plan: {
      mode: "handoff",
      destination,
      endpoint: new URL("/api/auth/complete-login", destinationUrl).toString(),
      token,
    },
  };
}

export function sealAuthHandoff(payload: AuthHandoffPayload) {
  const secret = getAuthHandoffSecret();

  if (!secret) {
    throw new Error("AUTH_HANDOFF_SECRET 환경변수가 설정되지 않았습니다.");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(secret), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv, encrypted, authTag].map(base64UrlEncode).join(".");
}

export function openAuthHandoff(token: string) {
  const secret = getAuthHandoffSecret();

  if (!secret) {
    throw new Error("AUTH_HANDOFF_SECRET 환경변수가 설정되지 않았습니다.");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("잘못된 로그인 handoff 형식입니다.");
  }

  const [iv, encrypted, authTag] = parts.map(base64UrlDecode);
  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(secret), iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  const payload = JSON.parse(decrypted.toString("utf8")) as AuthHandoffPayload;

  if (!payload.accessToken || !payload.refreshToken || !payload.role) {
    throw new Error("로그인 handoff payload가 올바르지 않습니다.");
  }

  if (payload.expiresAt <= Date.now()) {
    throw new Error("로그인 handoff가 만료되었습니다.");
  }

  return payload;
}
