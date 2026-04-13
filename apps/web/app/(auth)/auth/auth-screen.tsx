"use client";

import * as React from "react";
import { ArrowUpRight, ChevronLeft, GraduationCap, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import {
  Badge,
  BrandLogo,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  PasswordVisibilityButton,
  Textarea,
  cn,
} from "@modus/classroom-ui";

import {
  formatExpiresAt,
  getDestinationForRole,
  MBTI_OPTIONS,
  getMissingDestinationMessage,
  readErrorMessage,
  validateLogin,
  validateSignupEmail,
  validateSignupProfile,
  validateStudentSurvey,
  type AuthMode,
  type LoginField,
  type SignupField,
} from "../../../lib/auth/contracts";
import { useLoginMutation, useSendSignupVerificationMutation, useSignupMutation } from "../../../hooks/use-auth";
import { useAuthStore } from "../../../store/auth-store";

type AuthScreenProps = {
  initialMode?: AuthMode;
};

type SignupCompletionSurvey = NonNullable<
  import("../../../lib/auth/contracts").SignupSuccessPayload["survey"]
>;

const layerClassName =
  "flex h-full min-h-full w-full items-center justify-center overflow-hidden p-3 sm:p-4 lg:absolute lg:inset-0 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:gap-5 lg:p-0 xl:gap-6";

function submitAuthHandoffForm(endpoint: string, token: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = endpoint;
  form.style.display = "none";

  const tokenField = document.createElement("input");
  tokenField.type = "hidden";
  tokenField.name = "token";
  tokenField.value = token;

  form.append(tokenField);
  document.body.append(form);
  form.submit();
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm leading-5 text-rose-600">{message}</p>;
}

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const {
    mode,
    signupRole,
    signupStep,
    showVerificationInput,
    verificationRequested,
    verificationExpiresAt,
    loginForm,
    signupForm,
    loginFieldErrors,
    signupFieldErrors,
    openSignup,
    openLogin,
    resetSignupFlow,
    selectSignupRole,
    setSignupStep,
    setMode,
    setLoginField,
    setSignupField,
    setLoginFieldErrors,
    setSignupFieldErrors,
    markVerificationRequested,
    prepareLoginAfterSignup,
  } = useAuthStore();

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const sendVerificationMutation = useSendSignupVerificationMutation();
  const [signupSurveyError, setSignupSurveyError] = React.useState<string | null>(null);
  const [signupCompletion, setSignupCompletion] = React.useState<{
    email: string;
    survey: SignupCompletionSurvey;
  } | null>(null);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, setMode]);

  React.useEffect(() => {
    const syncModeFromHash = () => {
      setMode(window.location.hash === "#signup" ? "signup" : "login");
    };

    syncModeFromHash();
    window.addEventListener("hashchange", syncModeFromHash);

    return () => {
      window.removeEventListener("hashchange", syncModeFromHash);
    };
  }, [setMode]);

  React.useEffect(() => {
    const targetUrl = mode === "signup" ? "/auth#signup" : "/auth";

    if (`${window.location.pathname}${window.location.hash}` === targetUrl) {
      return;
    }

    window.history.replaceState(null, "", targetUrl);
  }, [mode]);

  React.useEffect(() => {
    if (mode !== "signup") {
      setSignupSurveyError(null);
      setSignupCompletion(null);
    }
  }, [mode]);

  const handleSignupFieldChange = React.useCallback(
    (field: SignupField, value: string) => {
      setSignupSurveyError(null);
      setSignupField(field, value);
    },
    [setSignupField],
  );

  const handleSelectSignupRole = React.useCallback(
    (role: "student" | "teacher") => {
      setSignupSurveyError(null);
      selectSignupRole(role);
    },
    [selectSignupRole],
  );

  const handleResetSignupFlow = React.useCallback(() => {
    setSignupSurveyError(null);
    setSignupCompletion(null);
    resetSignupFlow();
  }, [resetSignupFlow]);

  const handleGoToStudentSurvey = React.useCallback(() => {
    const errors = validateSignupProfile(signupForm);

    if (!verificationRequested) {
      errors.verificationCode = "이메일 인증을 먼저 진행하세요.";
    } else if (!signupForm.verificationCode.trim()) {
      errors.verificationCode = "인증번호를 입력하세요.";
    }

    setSignupFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSignupSurveyError(null);
    setSignupStep("survey");
  }, [setSignupFieldErrors, setSignupStep, signupForm, verificationRequested]);

  const handleBackToProfile = React.useCallback(() => {
    setSignupSurveyError(null);
    setSignupStep("profile");
  }, [setSignupStep]);

  const handleSignupResultContinue = React.useCallback(() => {
    if (!signupCompletion) {
      return;
    }

    prepareLoginAfterSignup(signupCompletion.email);
    setSignupCompletion(null);
    toast.success("회원가입이 완료되었습니다. 로그인하세요.");
  }, [prepareLoginAfterSignup, signupCompletion]);

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
        toast.error("로그인 응답을 확인하지 못했습니다.");
        return;
      }

      if (payload.authTransfer) {
        submitAuthHandoffForm(payload.authTransfer.endpoint, payload.authTransfer.token);
        return;
      }

      const destination = getDestinationForRole(payload.user.role);

      if (!destination) {
        toast.error(getMissingDestinationMessage(payload.user.role));
        return;
      }

      window.location.assign(destination);
    } catch (error) {
      toast.error(readErrorMessage(error, "로그인 요청 중 문제가 발생했습니다."));
    }
  };

  const handleSendVerification = async () => {
    const errors = validateSignupEmail(signupForm.email);

    setSignupFieldErrors({
      ...signupFieldErrors,
      email: errors.email,
      verificationCode: undefined,
    });

    if (errors.email) {
      return;
    }

    try {
      const payload = await sendVerificationMutation.mutateAsync({
        email: signupForm.email.trim(),
      });

      markVerificationRequested(payload.expiresAt);
      toast.success(payload.message);
    } catch (error) {
      toast.error(readErrorMessage(error, "인증번호 발송 중 문제가 발생했습니다."));
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signupRole) {
      toast.error("역할을 먼저 선택하세요.");
      handleResetSignupFlow();
      return;
    }

    const errors = validateSignupProfile(signupForm);
    const studentSurveyErrors = signupRole === "student" ? validateStudentSurvey(signupForm) : {};

    if (!verificationRequested) {
      errors.verificationCode = "이메일 인증을 먼저 진행하세요.";
    } else if (!signupForm.verificationCode.trim()) {
      errors.verificationCode = "인증번호를 입력하세요.";
    }

    const mergedErrors =
      signupRole === "student"
        ? {
            ...errors,
            ...studentSurveyErrors,
          }
        : errors;

    setSignupFieldErrors(mergedErrors);

    if (Object.keys(mergedErrors).length > 0) {
      return;
    }

    try {
      setSignupSurveyError(null);

      const payload = await signupMutation.mutateAsync({
        ...signupForm,
        role: signupRole,
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        verificationCode: signupForm.verificationCode.trim(),
        mbti: signupForm.mbti.trim(),
        personality: signupForm.personality.trim(),
        preference: signupForm.preference.trim(),
      });

      if (signupRole === "student") {
        if (payload.surveySubmitted) {
          if (payload.survey) {
            setSignupCompletion({
              email: signupForm.email.trim(),
              survey: payload.survey,
            });
            return;
          }

          prepareLoginAfterSignup(signupForm.email.trim());
          toast.success("회원가입이 완료되었습니다. 로그인하세요.");
          return;
        }

        if (payload.authenticated && payload.user?.role === "student" && payload.surveySubmitted === false) {
          setSignupSurveyError(payload.surveyMessage || "학생 설문 저장에 실패했습니다. 다시 시도해 주세요.");
          return;
        }
      }

      prepareLoginAfterSignup(signupForm.email.trim());
      toast.success("회원가입이 완료되었습니다. 로그인하세요.");
    } catch (error) {
      toast.error(readErrorMessage(error, "회원가입 요청 중 문제가 발생했습니다."));
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
          fieldErrors={loginFieldErrors}
          form={loginForm}
          pending={loginMutation.isPending}
          onChange={setLoginField}
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
          expiresAt={verificationExpiresAt}
          fieldErrors={signupFieldErrors}
          form={signupForm}
          pending={signupMutation.isPending}
          role={signupRole}
          completion={signupCompletion}
          surveyError={signupSurveyError}
          step={signupStep}
          showVerificationInput={showVerificationInput}
          sendVerificationPending={sendVerificationMutation.isPending}
          onBackToRoleSelect={handleResetSignupFlow}
          onBackToProfile={handleBackToProfile}
          onCompletionContinue={handleSignupResultContinue}
          onContinueToSurvey={handleGoToStudentSurvey}
          onChange={handleSignupFieldChange}
          onSendVerification={handleSendVerification}
          onSelectRole={handleSelectSignupRole}
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
  fieldErrors: Partial<Record<LoginField, string>>;
  form: { email: string; password: string };
  pending: boolean;
  onChange: (field: LoginField, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSwitchToSignup: () => void;
}) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

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
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    placeholder="이메일을 입력하세요"
                    autoComplete="email"
                    onChange={(event) => onChange("email", event.target.value)}
                    className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                  />
                </div>
                <FieldError message={fieldErrors.email} />
              </div>

              <div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={form.password}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                    onChange={(event) => onChange("password", event.target.value)}
                    className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pr-13 pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:pr-14 sm:pl-12 sm:text-base"
                  />
                  <PasswordVisibilityButton
                    visible={passwordVisible}
                    onToggle={() => setPasswordVisible((current) => !current)}
                  />
                </div>
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
  expiresAt,
  fieldErrors,
  form,
  pending,
  role,
  completion,
  surveyError,
  step,
  showVerificationInput,
  sendVerificationPending,
  onBackToRoleSelect,
  onBackToProfile,
  onCompletionContinue,
  onContinueToSurvey,
  onChange,
  onSendVerification,
  onSelectRole,
  onSubmitSignup,
  onSwitchToLogin,
}: {
  active: boolean;
  expiresAt: string | null;
  fieldErrors: Partial<Record<SignupField, string>>;
  form: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    verificationCode: string;
    mbti: string;
    personality: string;
    preference: string;
  };
  pending: boolean;
  role: "student" | "teacher" | null;
  completion: {
    email: string;
    survey: SignupCompletionSurvey;
  } | null;
  surveyError: string | null;
  step: "role" | "profile" | "survey";
  showVerificationInput: boolean;
  sendVerificationPending: boolean;
  onBackToRoleSelect: () => void;
  onBackToProfile: () => void;
  onCompletionContinue: () => void;
  onContinueToSurvey: () => void;
  onChange: (field: SignupField, value: string) => void;
  onSendVerification: () => Promise<void>;
  onSelectRole: (role: "student" | "teacher") => void;
  onSubmitSignup: (event: React.FormEvent<HTMLFormElement>) => void;
  onSwitchToLogin: () => void;
}) {
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] = React.useState(false);
  const formattedExpiresAt = formatExpiresAt(expiresAt);

  React.useEffect(() => {
    if (step === "role") {
      setResetDialogOpen(false);
    }
  }, [step]);

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

            {completion ? (
              <div className="space-y-5">
                <div className="space-y-1 px-1 text-center">
                  <p className="text-sm font-semibold text-primary/80">설문 결과</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                    {completion.survey.mbti || "학습 성향"}
                  </h2>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-[#f3dfab] bg-[linear-gradient(180deg,#fff7dd_0%,#fffaf0_100%)] px-6 py-8 text-center shadow-[0_18px_40px_rgba(212,169,37,0.12)]">
                  <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-white/70 text-3xl font-semibold text-[#c79d18] shadow-[0_12px_28px_rgba(199,157,24,0.16)] sm:size-28 sm:text-4xl">
                    {completion.survey.mbti?.slice(0, 2) || "S"}
                  </div>
                  <p className="mt-6 text-3xl font-semibold tracking-tight text-[#d1ab1d] sm:text-4xl">
                    {completion.survey.mbti || "학습 성향"}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">{completion.email}</p>
                  <div className="mt-6 space-y-3 text-left text-sm leading-7 text-slate-600 sm:text-[15px]">
                    <p className="rounded-[20px] bg-white/70 px-4 py-3">{completion.survey.personality}</p>
                    <p className="rounded-[20px] bg-white/70 px-4 py-3">{completion.survey.preference}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="h-12 w-full rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[52px] sm:rounded-[16px] sm:text-[1.02rem]"
                  onClick={onCompletionContinue}
                >
                  로그인하기
                </Button>
              </div>
            ) : step === "profile" || step === "survey" ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 rounded-[18px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground sm:text-lg">{role === "student" ? "수강생 계정" : "교강사 계정"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={step === "survey" ? onBackToProfile : onBackToRoleSelect}
                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ChevronLeft className="size-4" />
                    {step === "survey" ? "기본 정보 수정" : "역할 변경"}
                  </button>
                </div>

                <form className="space-y-3.5 sm:space-y-4" onSubmit={onSubmitSignup}>
                  {step === "profile" ? (
                    <>
                      <div>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                          <Input
                            id="name"
                            value={form.name}
                            placeholder="본명을 입력하세요"
                            autoComplete="name"
                            onChange={(event) => onChange("name", event.target.value)}
                            className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                          />
                        </div>
                        <FieldError message={fieldErrors.name} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="relative flex-1">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                            <Input
                              id="signup-email"
                              type="email"
                              value={form.email}
                              placeholder="이메일을 입력하세요"
                              autoComplete="email"
                              onChange={(event) => onChange("email", event.target.value)}
                              className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 pr-4 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={sendVerificationPending}
                            onClick={onSendVerification}
                            className="mt-1 h-[44px] rounded-[14px] border-primary/15 bg-[#f8faff] px-4 text-sm font-semibold text-primary hover:bg-primary/5 sm:h-[48px] sm:rounded-[16px]"
                          >
                            {sendVerificationPending ? "전송 중" : showVerificationInput ? "재인증" : "인증"}
                          </Button>
                        </div>
                        <FieldError message={fieldErrors.email} />

                        {showVerificationInput ? (
                          <div className="space-y-2">
                            <div className="relative">
                              <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                              <Input
                                id="verification-code"
                                value={form.verificationCode}
                                placeholder="인증번호를 입력하세요"
                                autoComplete="one-time-code"
                                onChange={(event) => onChange("verificationCode", event.target.value)}
                                className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                              />
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">
                              이메일로 받은 인증코드를 입력해 주세요.
                              {formattedExpiresAt ? ` 인증 유효시간: ${formattedExpiresAt}` : ""}
                            </p>
                            <FieldError message={fieldErrors.verificationCode} />
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                          <Input
                            id="signup-password"
                            type={passwordVisible ? "text" : "password"}
                            value={form.password}
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="new-password"
                            onChange={(event) => onChange("password", event.target.value)}
                            className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pr-13 pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pr-14 sm:pl-12 sm:text-base"
                          />
                          <PasswordVisibilityButton
                            visible={passwordVisible}
                            onToggle={() => setPasswordVisible((current) => !current)}
                          />
                        </div>
                        <FieldError message={fieldErrors.password} />
                      </div>

                      <div>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                          <Input
                            id="confirm-password"
                            type={passwordConfirmationVisible ? "text" : "password"}
                            value={form.passwordConfirmation}
                            placeholder="비밀번호를 다시 입력하세요"
                            autoComplete="new-password"
                            onChange={(event) => onChange("passwordConfirmation", event.target.value)}
                            className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pr-13 pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pr-14 sm:pl-12 sm:text-base"
                          />
                          <PasswordVisibilityButton
                            visible={passwordConfirmationVisible}
                            onToggle={() => setPasswordConfirmationVisible((current) => !current)}
                          />
                        </div>
                        <FieldError message={fieldErrors.passwordConfirmation} />
                      </div>
                    </>
                  ) : null}

                  {step === "survey" && role === "student" ? (
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="space-y-1 px-1">
                        <p className="text-sm font-semibold text-foreground sm:text-base">학습 성향 설문</p>
                        <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                          모둠 활동 매칭과 협업 스타일 파악을 위해 학생 설문을 함께 입력해 주세요.
                        </p>
                        {surveyError ? <FieldError message={surveyError} /> : null}
                      </div>

                      <div className="space-y-2">
                        <p className="px-1 text-xs font-medium text-muted-foreground sm:text-sm">MBTI</p>
                        <select
                          id="signup-mbti"
                          value={form.mbti}
                          onChange={(event) => onChange("mbti", event.target.value)}
                          className="h-[52px] w-full rounded-[16px] border-transparent bg-[#eef3fb] px-4 text-[15px] text-foreground shadow-none outline-none sm:h-[56px] sm:rounded-[18px] sm:px-5 sm:text-base"
                        >
                          <option value="">MBTI를 선택하세요</option>
                          {MBTI_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <FieldError message={fieldErrors.mbti} />
                      </div>

                      <div className="space-y-2">
                        <p className="px-1 text-xs font-medium text-muted-foreground sm:text-sm">성향</p>
                        <Textarea
                          id="signup-personality"
                          value={form.personality}
                          placeholder="예: 계획적으로 움직이는 편이고 역할이 분명한 협업을 선호합니다."
                          onChange={(event) => onChange("personality", event.target.value)}
                          className="min-h-[112px] rounded-[16px] border-transparent bg-[#eef3fb] px-4 py-3 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:rounded-[18px] sm:px-5 sm:py-4 sm:text-base"
                        />
                        <FieldError message={fieldErrors.personality} />
                      </div>

                      <div className="space-y-2">
                        <p className="px-1 text-xs font-medium text-muted-foreground sm:text-sm">선호 협업 방식</p>
                        <Textarea
                          id="signup-preference"
                          value={form.preference}
                          placeholder="예: 정리된 문서 협업과 일정 기반 진행을 선호합니다."
                          onChange={(event) => onChange("preference", event.target.value)}
                          className="min-h-[112px] rounded-[16px] border-transparent bg-[#eef3fb] px-4 py-3 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:rounded-[18px] sm:px-5 sm:py-4 sm:text-base"
                        />
                        <FieldError message={fieldErrors.preference} />
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="h-12 rounded-[15px] sm:h-[52px] sm:rounded-[16px]">
                          처음부터 다시
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>회원가입을 처음부터 다시 시작할까요?</DialogTitle>
                          <DialogDescription>
                            지금까지 입력한 역할과 회원가입 정보가 모두 초기화됩니다. 계속하려면 다시 입력해야 합니다.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">계속 작성</Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={() => {
                              setResetDialogOpen(false);
                              onBackToRoleSelect();
                            }}
                          >
                            처음부터 다시
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      type={step === "profile" && role === "student" ? "button" : "submit"}
                      size="lg"
                      disabled={pending}
                      className="h-12 rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[52px] sm:rounded-[16px] sm:text-[1.02rem]"
                      onClick={step === "profile" && role === "student" ? onContinueToSurvey : undefined}
                    >
                      {step === "profile" && role === "student"
                        ? "다음"
                        : pending
                          ? (role === "student" && surveyError ? "저장 중..." : "가입 중...")
                          : role === "student" && surveyError
                            ? "설문 다시 저장"
                            : "회원가입"}
                    </Button>
                  </div>
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
