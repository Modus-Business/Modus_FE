"use client";

import { useMutation } from "@tanstack/react-query";

import { authApiClient } from "../lib/auth/client";
import type {
  LoginForm,
  LoginSuccessPayload,
  SendVerificationSuccessPayload,
  SignupForm,
  SignupRole,
  SignupSuccessPayload,
} from "../lib/auth/contracts";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (form: LoginForm) =>
      (await authApiClient.post<LoginSuccessPayload>("/api/auth/login", form)).data,
  });
}

export function useSendSignupVerificationMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string }) =>
      (await authApiClient.post<SendVerificationSuccessPayload>("/api/auth/signup/send-verification", payload))
        .data,
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (payload: SignupForm & { role: SignupRole }) =>
      (await authApiClient.post<SignupSuccessPayload>("/api/auth/signup", payload)).data,
  });
}
