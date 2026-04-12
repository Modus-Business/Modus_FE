import "server-only";

import { postAuth } from "./server-client";
import type { AuthRole } from "./contracts";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  email: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type SendSignupVerificationRequest = {
  email: string;
};

export type SendSignupVerificationResponseData = {
  message: string;
  expiresAt: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  verificationCode: string;
  role: AuthRole;
  password: string;
  passwordConfirmation: string;
};

export type SignupResponseData = {
  userId: string;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: string;
};

export function login(body: LoginRequest) {
  return postAuth<LoginResponseData>("/auth/login", body);
}

export function refresh(refreshToken: string) {
  return postAuth<LoginResponseData>("/auth/login/refresh", { refreshToken } satisfies RefreshRequest);
}

export function logout(refreshToken: string) {
  return postAuth<{ message: string }>("/auth/logout", { refreshToken } satisfies LogoutRequest);
}

export function sendSignupVerification(body: SendSignupVerificationRequest) {
  return postAuth<SendSignupVerificationResponseData>("/auth/signup/send-verification", body);
}

export function signup(body: SignupRequest) {
  return postAuth<SignupResponseData>("/auth/signup", body);
}
