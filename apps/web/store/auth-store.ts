"use client";

import { create } from "zustand";

import type {
  AuthMode,
  FieldErrors,
  LoginField,
  LoginForm,
  SignupField,
  SignupForm,
  SignupRole,
} from "../lib/auth/contracts";
import { emptyLoginForm, emptySignupForm } from "../lib/auth/contracts";

type SignupStep = "role" | "profile";

type AuthStore = {
  mode: AuthMode;
  signupRole: SignupRole | null;
  signupStep: SignupStep;
  showVerificationInput: boolean;
  verificationRequested: boolean;
  verificationExpiresAt: string | null;
  loginForm: LoginForm;
  signupForm: SignupForm;
  loginFieldErrors: FieldErrors<LoginField>;
  signupFieldErrors: FieldErrors<SignupField>;
  openSignup: () => void;
  openLogin: () => void;
  resetSignupFlow: () => void;
  selectSignupRole: (role: SignupRole) => void;
  setMode: (mode: AuthMode) => void;
  setLoginField: (field: LoginField, value: string) => void;
  setSignupField: (field: SignupField, value: string) => void;
  setLoginFieldErrors: (errors: FieldErrors<LoginField>) => void;
  setSignupFieldErrors: (errors: FieldErrors<SignupField>) => void;
  markVerificationRequested: (expiresAt: string | null) => void;
  prepareLoginAfterSignup: (email: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  mode: "login",
  signupRole: null,
  signupStep: "role",
  showVerificationInput: false,
  verificationRequested: false,
  verificationExpiresAt: null,
  loginForm: emptyLoginForm,
  signupForm: emptySignupForm,
  loginFieldErrors: {},
  signupFieldErrors: {},
  openSignup: () =>
    set({
      mode: "signup",
      signupRole: null,
      signupStep: "role",
      showVerificationInput: false,
      verificationRequested: false,
      verificationExpiresAt: null,
      signupForm: emptySignupForm,
      signupFieldErrors: {},
      loginFieldErrors: {},
    }),
  openLogin: () =>
    set({
      mode: "login",
      loginFieldErrors: {},
      signupFieldErrors: {},
    }),
  resetSignupFlow: () =>
    set({
      signupRole: null,
      signupStep: "role",
      showVerificationInput: false,
      verificationRequested: false,
      verificationExpiresAt: null,
      signupForm: emptySignupForm,
      signupFieldErrors: {},
    }),
  selectSignupRole: (role) =>
    set({
      signupRole: role,
      signupStep: "profile",
      showVerificationInput: false,
      verificationRequested: false,
      verificationExpiresAt: null,
      signupForm: emptySignupForm,
      signupFieldErrors: {},
    }),
  setMode: (mode) => set({ mode }),
  setLoginField: (field, value) =>
    set((state) => ({
      loginForm: {
        ...state.loginForm,
        [field]: value,
      },
      loginFieldErrors: {
        ...state.loginFieldErrors,
        [field]: undefined,
      },
    })),
  setSignupField: (field, value) =>
    set((state) => {
      if (field !== "email") {
        return {
          signupForm: {
            ...state.signupForm,
            [field]: value,
          },
          signupFieldErrors: {
            ...state.signupFieldErrors,
            [field]: undefined,
          },
        };
      }

      const emailChanged =
        state.signupForm.email.trim().toLowerCase() !== value.trim().toLowerCase();

      return {
        signupForm: {
          ...state.signupForm,
          email: value,
          verificationCode: emailChanged ? "" : state.signupForm.verificationCode,
        },
        signupFieldErrors: {
          ...state.signupFieldErrors,
          email: undefined,
          verificationCode: undefined,
        },
        showVerificationInput: emailChanged ? false : state.showVerificationInput,
        verificationRequested: emailChanged ? false : state.verificationRequested,
        verificationExpiresAt: emailChanged ? null : state.verificationExpiresAt,
      };
    }),
  setLoginFieldErrors: (errors) => set({ loginFieldErrors: errors }),
  setSignupFieldErrors: (errors) => set({ signupFieldErrors: errors }),
  markVerificationRequested: (expiresAt) =>
    set({
      showVerificationInput: true,
      verificationRequested: true,
      verificationExpiresAt: expiresAt,
      signupFieldErrors: {},
    }),
  prepareLoginAfterSignup: (email) =>
    set({
      mode: "login",
      signupRole: null,
      signupStep: "role",
      showVerificationInput: false,
      verificationRequested: false,
      verificationExpiresAt: null,
      signupForm: emptySignupForm,
      signupFieldErrors: {},
      loginFieldErrors: {},
      loginForm: {
        email,
        password: "",
      },
    }),
}));
