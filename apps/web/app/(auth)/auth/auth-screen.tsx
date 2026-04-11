"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, ChevronLeft, GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import {
  Badge,
  BrandLogo,
  Button,
  Card,
  CardContent,
  Input,
  cn,
} from "@modus/classroom-ui";

type AuthMode = "login" | "signup";
type SignupRole = "student" | "teacher";

type AuthScreenProps = {
  initialMode?: AuthMode;
};

type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  verificationCode: string;
};

type LoginField = keyof LoginForm;
type SignupField = keyof SignupForm;
type FieldErrors<T extends string> = Partial<Record<T, string>>;
type AuthRole = "student" | "teacher";
type LoginSuccessPayload = {
  authenticated: boolean;
  user?: {
    email: string;
    role: AuthRole;
  };
};
type SignupSuccessPayload = {
  signedUp: boolean;
  email: string;
};
type SendVerificationSuccessPayload = {
  sent: boolean;
};

const layerClassName =
  "flex h-full min-h-full w-full items-center justify-center overflow-hidden p-3 sm:p-4 lg:absolute lg:inset-0 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:gap-5 lg:p-0 xl:gap-6";
const studentDestination = process.env.NEXT_PUBLIC_STUDENT;
const teacherDestination = process.env.NEXT_PUBLIC_TEACHER;

const emptyLoginForm: LoginForm = {
  email: "",
  password: "",
};

const emptySignupForm: SignupForm = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  verificationCode: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) {
    const normalized = message.filter((entry): entry is string => typeof entry === "string");
    return normalized[0] ?? fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

function getDestinationForRole(role: AuthRole) {
  return role === "student" ? studentDestination : teacherDestination;
}

function getMissingDestinationMessage(role: AuthRole) {
  return role === "student" ? "학생 서비스 주소가 설정되지 않았습니다." : "교강사 서비스 주소가 설정되지 않았습니다.";
}

function validateLogin(form: LoginForm): FieldErrors<LoginField> {
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

function validateSignupProfile(form: SignupForm): FieldErrors<SignupField> {
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

function validateSignupEmail(form: SignupForm): FieldErrors<SignupField> {
  const errors: FieldErrors<SignupField> = {};

  if (!form.email.trim()) {
    errors.email = "이메일을 입력하세요.";
  } else if (!isValidEmail(form.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm leading-5 text-rose-600">{message}</p>;
}

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as TResponse | null;

  if (!response.ok) {
    throw payload;
  }

  if (!payload) {
    throw new Error("응답 본문이 비어 있습니다.");
  }

  return payload;
}

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [signupRole, setSignupRole] = React.useState<SignupRole | null>(null);
  const [signupStep, setSignupStep] = React.useState<"role" | "profile">("role");
  const [showVerificationInput, setShowVerificationInput] = React.useState(false);
  const [verificationRequested, setVerificationRequested] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState<LoginForm>(emptyLoginForm);
  const [signupForm, setSignupForm] = React.useState<SignupForm>(emptySignupForm);
  const [loginFieldErrors, setLoginFieldErrors] = React.useState<FieldErrors<LoginField>>({});
  const [signupFieldErrors, setSignupFieldErrors] = React.useState<FieldErrors<SignupField>>({});

  const showLoginError = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showSignupError = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (form: LoginForm) => postJson<LoginSuccessPayload>("/api/auth/login", form),
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupForm & { role: SignupRole }) => postJson<SignupSuccessPayload>("/api/auth/signup", payload),
  });

  const sendVerificationMutation = useMutation({
    mutationFn: (payload: { email: string }) => postJson<SendVerificationSuccessPayload>("/api/auth/signup/send-verification", payload),
  });

  const openSignup = React.useCallback(() => {
    setMode("signup");
    setSignupRole(null);
    setSignupStep("role");
    setShowVerificationInput(false);
    setVerificationRequested(false);
    setLoginFieldErrors({});
  }, []);

  const openLogin = React.useCallback(() => {
    setMode("login");
    setShowVerificationInput(false);
    setVerificationRequested(false);
    setSignupFieldErrors({});
  }, []);

  React.useEffect(() => {
    const syncModeFromHash = () => {
      setMode(window.location.hash === "#signup" ? "signup" : "login");
    };

    syncModeFromHash();
    window.addEventListener("hashchange", syncModeFromHash);

    return () => {
      window.removeEventListener("hashchange", syncModeFromHash);
    };
  }, []);

  React.useEffect(() => {
    const targetUrl = mode === "signup" ? "/auth#signup" : "/auth";

    if (`${window.location.pathname}${window.location.hash}` === targetUrl) {
      return;
    }

    window.history.replaceState(null, "", targetUrl);
  }, [mode]);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateLogin(loginForm);
    setLoginFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const payload = await loginMutation.mutateAsync(loginForm);

      if (!payload?.authenticated || !payload.user) {
        showLoginError("로그인 응답을 확인하지 못했습니다.");
        return;
      }

      const destination = getDestinationForRole(payload.user.role);

      if (!destination) {
        return showLoginError(getMissingDestinationMessage(payload.user.role));
      }

      window.location.assign(destination);
    } catch (error) {
      showLoginError(readErrorMessage(error, "로그인 요청 중 문제가 발생했습니다."));
    }
  };

  const handleOpenVerificationStep = async () => {
    const errors = validateSignupEmail(signupForm);

    setSignupFieldErrors((current) => ({
      ...current,
      email: errors.email,
    }));

    if (errors.email) {
      return;
    }

    try {
      await sendVerificationMutation.mutateAsync({ email: signupForm.email });
      setShowVerificationInput(true);
      setVerificationRequested(true);
      toast.success("인증번호를 이메일로 보냈습니다.");
    } catch (error) {
      showSignupError(readErrorMessage(error, "인증번호 발송 중 문제가 발생했습니다."));
    }
  };

  const handleSignupSubmit = async () => {
    if (!signupRole) {
      showSignupError("역할을 먼저 선택하세요.");
      setSignupStep("role");
      return;
    }

    const errors = validateSignupProfile(signupForm);
    setSignupFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSignupStep("profile");
      return;
    }

    if (!verificationRequested) {
      showSignupError("이메일 인증을 먼저 진행하세요.");
      return;
    }

    if (!signupForm.verificationCode.trim()) {
      showSignupError("인증번호를 입력하세요.");
      return;
    }

    try {
      await signupMutation.mutateAsync({
        ...signupForm,
        role: signupRole,
      });

      setMode("login");
      setSignupRole(null);
      setSignupStep("role");
      setShowVerificationInput(false);
      setVerificationRequested(false);
      setSignupForm(emptySignupForm);
      setSignupFieldErrors({});
      setLoginFieldErrors({});
      setLoginForm({
        email: signupForm.email,
        password: "",
      });
      toast.success("회원가입이 완료되었습니다. 로그인하세요.");
    } catch (error) {
      showSignupError(readErrorMessage(error, "회원가입 요청 중 문제가 발생했습니다."));
    }
  };

  return (
    <div className="relative h-full min-h-full overflow-hidden rounded-[28px] bg-[#eef3fb] sm:rounded-[32px]">
      <div
        aria-hidden={mode !== "login"}
        className={cn(
          layerClassName,
          mode === "login" ? "relative z-20 h-full min-h-full opacity-100" : "pointer-events-none absolute inset-0 z-10 opacity-0",
        )}
      >
        <LoginVisual active={mode === "login"} />
        <LoginCard
          active={mode === "login"}
          form={loginForm}
          fieldErrors={loginFieldErrors}
          pending={loginMutation.isPending}
          onChange={setLoginForm}
          onSubmit={handleLoginSubmit}
          onSwitchToSignup={openSignup}
        />
      </div>

      <div
        aria-hidden={mode !== "signup"}
        className={cn(
          layerClassName,
          mode === "signup" ? "relative z-20 h-full min-h-full opacity-100" : "pointer-events-none absolute inset-0 z-10 opacity-0",
        )}
      >
        <SignupCard
          active={mode === "signup"}
          role={signupRole}
          step={signupStep}
          form={signupForm}
          fieldErrors={signupFieldErrors}
          pending={signupMutation.isPending}
          onBackToRoleSelect={() => {
            setSignupRole(null);
            setSignupStep("role");
            setShowVerificationInput(false);
            setVerificationRequested(false);
          }}
          onChange={setSignupForm}
          onOpenVerificationStep={handleOpenVerificationStep}
          onSelectRole={(role) => {
            setSignupRole(role);
            setSignupStep("profile");
            setShowVerificationInput(false);
            setVerificationRequested(false);
          }}
          showVerificationInput={showVerificationInput}
          sendVerificationPending={sendVerificationMutation.isPending}
          onSubmitSignup={handleSignupSubmit}
          onSwitchToLogin={openLogin}
        />
        <SignupVisual active={mode === "signup"} />
      </div>
    </div>
  );
}

function LoginVisual({ active }: { active: boolean }) {
  return (
    <section className="relative order-2 hidden min-h-[16rem] overflow-hidden rounded-[24px] border border-white/70 bg-white sm:min-h-[18rem] sm:rounded-[28px] lg:order-1 lg:block lg:h-full lg:min-h-0 lg:rounded-[34px]">
      <div
        className={cn(
          "absolute left-1/2 top-[58%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_68%_45%,#82a8ff_0%,#5b84ff_48%,#3f63d6_100%)] shadow-[0_20px_80px_rgba(91,132,255,0.28)] will-change-transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:h-[38rem] sm:w-[38rem] lg:-left-[50%] lg:top-1/2 lg:h-[860px] lg:w-[860px] lg:-translate-x-0 xl:-left-[46%] xl:h-[920px] xl:w-[920px]",
          active ? "translate-x-0 scale-100" : "translate-x-[12%] scale-[1.02]",
        )}
      />
      <div className="relative flex h-full items-end justify-center px-5 py-6 sm:px-7 sm:py-7 lg:items-center lg:justify-start lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-md text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-left",
            active ? "translate-x-0 opacity-100 delay-100" : "-translate-x-16 opacity-0",
          )}
        >
          <div className="inline-flex items-center">
            <BrandLogo size="auth" className="h-9 max-w-[160px] brightness-0 invert sm:h-10 sm:max-w-[180px] lg:h-11 lg:max-w-[190px]" />
          </div>
          <p className="mt-5 text-[10px] font-semibold tracking-[0.28em] text-white/72 uppercase sm:mt-6 sm:text-[11px] sm:tracking-[0.32em]">Modus Sign In</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:mt-3 sm:text-4xl lg:text-6xl">Welcome</h1>
          <p className="mt-2 text-sm leading-6 text-white/80 sm:mt-3 sm:text-base sm:leading-7">
            수업에 참여하거나 수업을 운영하려면 먼저 계정으로 로그인하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

function SignupVisual({ active }: { active: boolean }) {
  return (
    <section className="relative order-2 hidden min-h-[17rem] overflow-hidden rounded-[24px] border border-white/70 bg-white sm:min-h-[19rem] sm:rounded-[28px] lg:block lg:h-full lg:min-h-0 lg:rounded-[34px]">
      <div
        className={cn(
          "absolute left-1/2 top-[44%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_32%_45%,#82a8ff_0%,#5b84ff_48%,#3f63d6_100%)] shadow-[0_20px_80px_rgba(91,132,255,0.28)] will-change-transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:h-[40rem] sm:w-[40rem] lg:-right-[50%] lg:left-auto lg:top-1/2 lg:h-[860px] lg:w-[860px] lg:-translate-x-0 xl:-right-[46%] xl:h-[920px] xl:w-[920px]",
          active ? "translate-x-0 scale-100" : "-translate-x-[12%] scale-[1.02]",
        )}
      />
      <div className="relative flex h-full items-end justify-center px-5 py-6 sm:px-7 sm:py-8 lg:items-center lg:justify-end lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-md text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-right",
            active ? "translate-x-0 opacity-100 delay-100" : "translate-x-16 opacity-0",
          )}
        >
          <div className="flex justify-center lg:justify-end">
            <div className="inline-flex items-center">
              <BrandLogo size="auth" className="h-9 max-w-[160px] brightness-0 invert sm:h-10 sm:max-w-[180px] lg:h-11 lg:max-w-[190px]" />
            </div>
          </div>
          <p className="mt-5 text-[10px] font-semibold tracking-[0.28em] text-white/72 uppercase sm:mt-6 sm:text-[11px] sm:tracking-[0.32em]">Modus Sign Up</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">Join with us</h1>
          <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            처음 이용한다면 계정을 만들고 바로 수업 참여 또는 수업 운영을 시작할 수 있습니다.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3.5 py-2 text-xs text-white/88 sm:mt-6 sm:px-4 sm:text-sm">
            <ShieldCheck className="size-4" />
            학생과 교강사 모두 이용 가능
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginCard({
  active,
  fieldErrors,
  form,
  pending,
  onChange,
  onSubmit,
  onSwitchToSignup,
}: {
  active: boolean;
  fieldErrors: FieldErrors<LoginField>;
  form: LoginForm;
  pending: boolean;
  onChange: React.Dispatch<React.SetStateAction<LoginForm>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSwitchToSignup: () => void;
}) {
  return (
    <section className="order-1 flex min-h-fit w-full items-center justify-center px-1 py-4 sm:px-2 sm:py-5 lg:order-2 lg:h-full lg:rounded-[34px] lg:bg-white lg:px-8 lg:py-6">
      <div
        className={cn(
          "w-full max-w-[34rem] space-y-7 will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:space-y-8 lg:space-y-0",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "-translate-x-10 scale-[0.97] opacity-0",
        )}
      >
        <div className="space-y-3 px-2 text-center lg:hidden">
          <div className="flex justify-center">
            <BrandLogo size="auth" className="h-10 max-w-[176px]" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-primary/70 uppercase">Modus Sign In</p>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Welcome</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              수업에 참여하거나 수업을 운영하려면 먼저 계정으로 로그인하세요.
            </p>
          </div>
        </div>

        <Card className="w-full rounded-[22px] border-white/80 bg-white/96 shadow-[0_18px_40px_rgba(72,92,145,0.14)] sm:rounded-[26px] lg:rounded-[30px] lg:border-white/80 lg:bg-white/96 lg:shadow-[0_22px_50px_rgba(72,92,145,0.16)]">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="mb-3 sm:mb-4">
              <Badge variant="secondary" className="px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase">
                Sign in
              </Badge>
            </div>

            <form className="space-y-3.5 sm:space-y-4" onSubmit={onSubmit}>
              <div>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  placeholder="이메일을 입력하세요"
                  autoComplete="email"
                  onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))}
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:text-base"
                />
                <FieldError message={fieldErrors.email} />
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:text-base"
                />
                <FieldError message={fieldErrors.password} />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className="h-12 w-full rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[54px] sm:rounded-[16px] sm:text-[1.02rem]"
              >
                {pending ? "로그인 중..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm leading-6 text-foreground">
              계정이 없으신가요?{" "}
              <button type="button" onClick={onSwitchToSignup} className="font-semibold text-foreground transition-colors hover:text-primary">
                회원가입하기
              </button>
              <ArrowUpRight className="ml-1 inline size-4" />
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SignupCard({
  active,
  fieldErrors,
  form,
  pending,
  role,
  step,
  showVerificationInput,
  sendVerificationPending,
  onBackToRoleSelect,
  onChange,
  onOpenVerificationStep,
  onSelectRole,
  onSubmitSignup,
  onSwitchToLogin,
}: {
  active: boolean;
  fieldErrors: FieldErrors<SignupField>;
  form: SignupForm;
  pending: boolean;
  role: SignupRole | null;
  step: "role" | "profile";
  showVerificationInput: boolean;
  sendVerificationPending: boolean;
  onBackToRoleSelect: () => void;
  onChange: React.Dispatch<React.SetStateAction<SignupForm>>;
  onOpenVerificationStep: () => Promise<void>;
  onSelectRole: (role: SignupRole) => void;
  onSubmitSignup: () => void;
  onSwitchToLogin: () => void;
}) {
  return (
    <section className="order-1 flex min-h-fit w-full items-center justify-center px-1 py-4 sm:px-2 sm:py-5 lg:h-full lg:rounded-[34px] lg:bg-white lg:px-8 lg:py-6">
      <div
        className={cn(
          "w-full max-w-[35rem] space-y-7 will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:space-y-8 lg:space-y-0",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "translate-x-10 scale-[0.97] opacity-0",
        )}
      >
        <div className="space-y-3 px-2 text-center lg:hidden">
          <div className="flex justify-center">
            <BrandLogo size="auth" className="h-10 max-w-[176px]" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-primary/70 uppercase">Modus Sign Up</p>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Join with us</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              계정을 만들고 바로 수업 참여 또는 수업 운영을 시작할 수 있습니다.
            </p>
          </div>
        </div>

        <Card className="w-full rounded-[22px] border-white/80 bg-white/96 shadow-[0_18px_40px_rgba(72,92,145,0.14)] sm:rounded-[26px] lg:rounded-[30px] lg:border-white/80 lg:bg-white/96 lg:shadow-[0_22px_50px_rgba(72,92,145,0.16)]">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="mb-3 sm:mb-4">
              <Badge variant="secondary" className="px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase">
                Sign up
              </Badge>
            </div>

            {step === "role" ? (
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onSelectRole("student")}
                  className="rounded-[22px] border border-border/80 bg-white px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-primary/25 sm:rounded-[26px] sm:px-6 sm:py-7"
                >
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#eef4ff] text-primary sm:size-24 lg:size-28">
                    <GraduationCap className="size-9 sm:size-10 lg:size-12" />
                  </div>
                  <p className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:mt-6 sm:text-2xl">수강생</p>
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground sm:mt-3">
                    수업에 참여하고 모둠 활동을 진행할 계정을 만듭니다.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRole("teacher")}
                  className="rounded-[22px] border border-border/80 bg-white px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-primary/25 sm:rounded-[26px] sm:px-6 sm:py-7"
                >
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#eef4ff] text-primary sm:size-24 lg:size-28">
                    <ShieldCheck className="size-9 sm:size-10 lg:size-12" />
                  </div>
                  <p className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:mt-6 sm:text-2xl">교강사</p>
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground sm:mt-3">
                    수업을 개설하고 운영할 교강사 계정을 만듭니다.
                  </p>
                </button>
              </div>
            ) : null}

            {step === "profile" ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 rounded-[18px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground sm:text-lg">{role === "student" ? "수강생 계정" : "교강사 계정"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToRoleSelect}
                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ChevronLeft className="size-4" />
                    역할 변경
                  </button>
                </div>

                <form
                  className="space-y-3.5 sm:space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void onSubmitSignup();
                  }}
                >
                  <div>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                      <Input
                        id="name"
                        value={form.name}
                        placeholder="본명을 입력하세요"
                        autoComplete="name"
                        onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
                        className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                      />
                    </div>
                    <FieldError message={fieldErrors.name} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="signup-email"
                        type="email"
                        value={form.email}
                        placeholder="이메일을 입력하세요"
                        autoComplete="email"
                        onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))}
                        className="h-[52px] flex-1 rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={sendVerificationPending}
                        onClick={() => {
                          void onOpenVerificationStep();
                        }}
                        className="h-[52px] shrink-0 rounded-[14px] border-primary/20 bg-white px-5 text-sm font-semibold text-primary sm:h-[56px] sm:rounded-[16px] sm:px-6"
                      >
                        {sendVerificationPending ? "발송 중" : "인증"}
                      </Button>
                    </div>
                    <FieldError message={fieldErrors.email} />
                  </div>

                  {showVerificationInput ? (
                    <div className="rounded-[20px] border border-primary/20 bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)] px-4 py-4 shadow-[0_16px_32px_rgba(91,132,255,0.12)] sm:px-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-primary">이메일 인증번호</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            이메일로 받은 코드를 입력한 뒤 회원가입을 완료하세요.
                          </p>
                        </div>
                      </div>
                      <Input
                        id="verification-code"
                        value={form.verificationCode}
                        inputMode="numeric"
                        placeholder="인증번호를 입력하세요"
                        onChange={(event) => onChange((current) => ({ ...current, verificationCode: event.target.value }))}
                        className="h-[54px] rounded-[16px] border border-primary/25 bg-white text-[15px] shadow-[0_10px_24px_rgba(91,132,255,0.10)] placeholder:text-[#7f8ba3] focus-visible:ring-primary/30 sm:h-[58px] sm:rounded-[18px] sm:text-base"
                      />
                    </div>
                  ) : null}

                  <div>
                    <Input
                      id="signup-password"
                      type="password"
                      value={form.password}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="new-password"
                      onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
                      className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:text-base"
                    />
                    <FieldError message={fieldErrors.password} />
                  </div>

                  <div>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={form.passwordConfirmation}
                      placeholder="비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
                      onChange={(event) => onChange((current) => ({ ...current, passwordConfirmation: event.target.value }))}
                      className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:text-base"
                    />
                    <FieldError message={fieldErrors.passwordConfirmation} />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={pending}
                    className="h-12 w-full rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[52px] sm:rounded-[16px] sm:text-[1.02rem]"
                  >
                    {pending ? "처리 중..." : showVerificationInput ? "회원가입" : "가입 확인으로 계속"}
                  </Button>
                </form>
              </div>
            ) : null}

            <p className="mt-4 text-center text-sm leading-6 text-foreground">
              이미 계정이 있나요?{" "}
              <button type="button" onClick={onSwitchToLogin} className="font-semibold text-foreground transition-colors hover:text-primary">
                로그인하기
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
