import axios from "axios";

export type AuthMode = "login" | "signup";
export type SignupRole = "student" | "teacher";
export type AuthRole = "student" | "teacher";

export type LoginForm = {
  email: string;
  password: string;
};

export type SignupForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  verificationCode: string;
  mbti: string;
  personality: string;
  preference: string;
};

export type LoginField = keyof LoginForm;
export type SignupField = keyof SignupForm;
export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type LoginSuccessPayload = {
  authenticated: boolean;
  authTransfer?: {
    endpoint: string;
    token: string;
  };
  user?: {
    email: string;
    role: AuthRole;
  };
};

export type SignupSuccessPayload = {
  signedUp: boolean;
  email: string;
  authenticated?: boolean;
  user?: {
    email: string;
    role: AuthRole;
  };
  surveySubmitted?: boolean;
  surveyMessage?: string;
  survey?: {
    surveyId: string;
    userId: string;
    mbti: string | null;
    personality: string | null;
    preference: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type SendVerificationSuccessPayload = {
  message: string;
  expiresAt: string;
};

export const emptyLoginForm: LoginForm = {
  email: "",
  password: "",
};

export const emptySignupForm: SignupForm = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  verificationCode: "",
  mbti: "",
  personality: "",
  preference: "",
};

export const MBTI_OPTIONS = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function readErrorMessage(payload: unknown, fallback: string) {
  if (axios.isAxiosError(payload)) {
    return readErrorMessage(payload.response?.data, payload.message || fallback);
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) {
    const normalized = message.filter((entry): entry is string => typeof entry === "string");
    return normalized[0] || fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export function validateLogin(form: LoginForm): FieldErrors<LoginField> {
  const errors: FieldErrors<LoginField> = {};

  if (!form.email.trim()) {
    errors.email = "이메일을 입력하세요.";
  } else if (!isValidEmail(form.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  if (!form.password) {
    errors.password = "비밀번호를 입력하세요.";
  }

  return errors;
}

export function validateSignupProfile(form: SignupForm): FieldErrors<SignupField> {
  const errors: FieldErrors<SignupField> = {};

  if (!form.name.trim()) {
    errors.name = "이름을 입력하세요.";
  }

  if (!form.email.trim()) {
    errors.email = "이메일을 입력하세요.";
  } else if (!isValidEmail(form.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  if (!form.password) {
    errors.password = "비밀번호를 입력하세요.";
  } else if (form.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  if (!form.passwordConfirmation) {
    errors.passwordConfirmation = "비밀번호 확인을 입력하세요.";
  } else if (form.passwordConfirmation !== form.password) {
    errors.passwordConfirmation = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
}

export function validateStudentSurvey(form: SignupForm): FieldErrors<SignupField> {
  const errors: FieldErrors<SignupField> = {};

  if (!form.mbti.trim()) {
    errors.mbti = "MBTI를 선택하세요.";
  }

  if (!form.personality.trim()) {
    errors.personality = "성향을 입력하세요.";
  }

  if (!form.preference.trim()) {
    errors.preference = "선호하는 협업 방식을 입력하세요.";
  }

  return errors;
}

export function validateSignupEmail(email: string): FieldErrors<SignupField> {
  const errors: FieldErrors<SignupField> = {};

  if (!email.trim()) {
    errors.email = "이메일을 입력하세요.";
  } else if (!isValidEmail(email)) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  return errors;
}

export function formatExpiresAt(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDestinationForRole(role: AuthRole) {
  return role === "student" ? process.env.NEXT_PUBLIC_STUDENT : process.env.NEXT_PUBLIC_TEACHER;
}

export function getMissingDestinationMessage(role: AuthRole) {
  return role === "student" ? "학생 서비스 주소가 설정되지 않았습니다." : "교강사 서비스 주소가 설정되지 않았습니다.";
}
