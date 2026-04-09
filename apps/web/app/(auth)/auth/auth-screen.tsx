"use client";

import * as React from "react";
import { ArrowUpRight, ChevronLeft, GraduationCap, LockKeyhole, Mail, School, ShieldCheck, UserRound } from "lucide-react";

import { Badge, BrandLogo, Button, Card, CardContent, Input, cn } from "@modus/classroom-ui";

type AuthMode = "login" | "signup";
type SignupRole = "student" | "teacher";

type AuthScreenProps = {
  initialMode?: AuthMode;
};

const layerClassName = "absolute inset-0 grid h-full gap-3 lg:grid-cols-[1.04fr_0.96fr]";

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [signupRole, setSignupRole] = React.useState<SignupRole | null>(null);
  const [signupStep, setSignupStep] = React.useState<"school" | "role" | "profile" | "verify">("school");

  const openSignup = React.useCallback(() => {
    setMode("signup");
    setSignupRole(null);
    setSignupStep("school");
  }, []);

  const openLogin = React.useCallback(() => {
    setMode("login");
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

  return (
    <div className="relative h-full overflow-hidden">
      <div
        aria-hidden={mode !== "login"}
        className={cn(
          layerClassName,
          mode === "login" ? "z-20" : "pointer-events-none z-10"
        )}
      >
        <LoginVisual active={mode === "login"} />
        <LoginCard active={mode === "login"} onSwitchToSignup={openSignup} />
      </div>

      <div
        aria-hidden={mode !== "signup"}
        className={cn(
          layerClassName,
          mode === "signup" ? "z-20" : "pointer-events-none z-10"
        )}
      >
        <SignupCard
          active={mode === "signup"}
          role={signupRole}
          step={signupStep}
          onBackToRoleSelect={() => {
            setSignupRole(null);
            setSignupStep("school");
          }}
          onProceedToRoleSelect={() => setSignupStep("role")}
          onProceedToVerify={() => setSignupStep("verify")}
          onSelectRole={(role) => {
            setSignupRole(role);
            setSignupStep("profile");
          }}
          onSwitchToLogin={openLogin}
        />
        <SignupVisual active={mode === "signup"} />
      </div>
    </div>
  );
}

function LoginVisual({ active }: { active: boolean }) {
  return (
    <section className="relative order-2 h-full overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(73,95,148,0.10)] lg:order-1 lg:rounded-[34px]">
      <div
        className={cn(
          "absolute -left-[42%] top-1/2 h-[920px] w-[920px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_68%_45%,#82a8ff_0%,#5b84ff_48%,#3f63d6_100%)] shadow-[0_20px_80px_rgba(91,132,255,0.28)] will-change-transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          active ? "translate-x-0 scale-100" : "translate-x-[12%] scale-[1.02]"
        )}
      />
      <div className="relative flex h-full items-center justify-center px-6 py-8 lg:justify-start lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-sm text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-left",
            active ? "translate-x-0 opacity-100 delay-100" : "-translate-x-16 opacity-0"
          )}
        >
          <div className="inline-flex items-center">
            <BrandLogo size="auth" className="brightness-0 invert" />
          </div>
          <p className="mt-8 text-[11px] font-semibold tracking-[0.32em] text-white/72 uppercase">Modus Sign In</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Welcome</h1>
          <p className="mt-3 text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
            수업에 참여하거나 수업을 운영하려면 먼저 계정으로 로그인하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

function SignupVisual({ active }: { active: boolean }) {
  return (
    <section className="relative order-2 h-full overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(73,95,148,0.10)] lg:rounded-[34px]">
      <div
        className={cn(
          "absolute -right-[42%] top-1/2 h-[920px] w-[920px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_32%_45%,#82a8ff_0%,#5b84ff_48%,#3f63d6_100%)] shadow-[0_20px_80px_rgba(91,132,255,0.28)] will-change-transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          active ? "translate-x-0 scale-100" : "-translate-x-[12%] scale-[1.02]"
        )}
      />
      <div className="relative flex h-full items-center justify-center px-8 py-10 lg:justify-end lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-sm text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-right",
            active ? "translate-x-0 opacity-100 delay-100" : "translate-x-16 opacity-0"
          )}
        >
          <div className="flex justify-center lg:justify-end">
            <div className="inline-flex items-center">
              <BrandLogo size="auth" className="brightness-0 invert" />
            </div>
          </div>
          <p className="mt-10 text-[11px] font-semibold tracking-[0.32em] text-white/72 uppercase">Modus Sign Up</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Join with us</h1>
          <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
            처음 이용한다면 계정을 만들고 바로 수업 참여 또는 수업 운영을 시작할 수 있습니다.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm text-white/88">
            <ShieldCheck className="size-4" />
            학생과 교강사 모두 이용 가능
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginCard({ active, onSwitchToSignup }: { active: boolean; onSwitchToSignup: () => void }) {
  return (
    <section className="order-1 flex h-full items-center justify-center rounded-[30px] border border-border/70 bg-white px-4 py-5 shadow-[0_24px_80px_rgba(73,95,148,0.08)] lg:order-2 lg:rounded-[34px] lg:px-8 lg:py-6">
      <Card
        className={cn(
          "w-full max-w-[34rem] rounded-[26px] border-white/80 bg-white/96 shadow-[0_22px_50px_rgba(72,92,145,0.16)] will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:rounded-[30px]",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "-translate-x-10 scale-[0.97] opacity-0"
        )}
      >
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="mb-4">
            <Badge variant="secondary" className="px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase">
              Sign in
            </Badge>
          </div>

          <form className="space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                className="h-[58px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
              />
            </div>

            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                className="h-[58px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
              />
            </div>

            <Button type="submit" size="lg" className="h-[54px] w-full rounded-[16px] text-[1.02rem] shadow-[0_16px_34px_rgba(91,132,255,0.22)]">
              Sign in
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-foreground">
              계정이 없으신가요?{" "}
              <button type="button" onClick={onSwitchToSignup} className="font-semibold text-foreground transition-colors hover:text-primary">
                회원가입하기
              </button>
              <ArrowUpRight className="ml-1 inline size-4" />
            </p>
        </CardContent>
      </Card>
    </section>
  );
}

function SignupCard({
  active,
  role,
  step,
  onBackToRoleSelect,
  onProceedToRoleSelect,
  onProceedToVerify,
  onSelectRole,
  onSwitchToLogin,
}: {
  active: boolean;
  role: SignupRole | null;
  step: "school" | "role" | "profile" | "verify";
  onBackToRoleSelect: () => void;
  onProceedToRoleSelect: () => void;
  onProceedToVerify: () => void;
  onSelectRole: (role: SignupRole) => void;
  onSwitchToLogin: () => void;
}) {
  return (
    <section className="order-1 flex h-full items-center justify-center rounded-[30px] border border-border/70 bg-white px-4 py-5 shadow-[0_24px_80px_rgba(73,95,148,0.08)] lg:rounded-[34px] lg:px-8 lg:py-6">
      <Card
        className={cn(
          "w-full max-w-[35rem] rounded-[26px] border-white/80 bg-white/96 shadow-[0_22px_50px_rgba(72,92,145,0.16)] will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:rounded-[30px]",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "translate-x-10 scale-[0.97] opacity-0"
        )}
      >
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="mb-4">
            <Badge variant="secondary" className="px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase">
              Sign up
            </Badge>
          </div>

          {step === "school" ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                onProceedToRoleSelect();
              }}
            >
              <div className="rounded-[18px] bg-[#f8faff] px-4 py-3">
                <p className="text-sm font-semibold text-foreground">학교 검색</p>
                <p className="mt-1 text-xs text-muted-foreground">가장 먼저 소속 학교를 선택해 주세요.</p>
              </div>

              <div className="relative">
                <School className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="school-name"
                  placeholder="학교 이름을 입력하세요"
                  autoComplete="organization"
                  className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
                />
              </div>

              <Button type="submit" size="lg" className="h-[52px] w-full rounded-[16px] text-[1.02rem] shadow-[0_16px_34px_rgba(91,132,255,0.22)]">
                계정 유형 선택
              </Button>
            </form>
          ) : null}

          {step === "role" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onSelectRole("student")}
                className="rounded-[26px] border border-border/80 bg-white px-6 py-7 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-primary/25"
              >
                <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#eef4ff] text-primary">
                  <GraduationCap className="size-12" />
                </div>
                <p className="mt-7 text-2xl font-semibold tracking-tight text-foreground">수강생</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  수업에 참여하고 모둠 활동을 진행할 계정을 만듭니다.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole("teacher")}
                className="rounded-[26px] border border-border/80 bg-white px-6 py-7 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-primary/25"
              >
                <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#eef4ff] text-primary">
                  <ShieldCheck className="size-12" />
                </div>
                <p className="mt-7 text-2xl font-semibold tracking-tight text-foreground">교강사</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  수업을 개설하고 운영할 교강사 계정을 만듭니다.
                </p>
              </button>
            </div>
          ) : null}

          {step === "profile" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f8faff] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{role === "student" ? "수강생 계정" : "교강사 계정"}</p>
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
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  onProceedToVerify();
                }}
              >
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="본명을 입력하세요"
                    autoComplete="name"
                    className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
                  />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    autoComplete="email"
                    className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
                  />
                </div>

                <Input
                  id="signup-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="new-password"
                  className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] text-base shadow-none placeholder:text-[#7f8ba3]"
                />

                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  autoComplete="new-password"
                  className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] text-base shadow-none placeholder:text-[#7f8ba3]"
                />

                <Button type="submit" size="lg" className="h-[52px] w-full rounded-[16px] text-[1.02rem] shadow-[0_16px_34px_rgba(91,132,255,0.22)]">
                  이메일 인증으로 계속
                </Button>
              </form>
            </div>
          ) : null}

          {step === "verify" ? (
            <div className="space-y-4">
              <div className="rounded-[20px] border border-primary/14 bg-[#f8faff] px-4 py-4">
                <p className="text-sm font-semibold text-foreground">이메일 인증</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  입력한 이메일로 인증번호를 보냈습니다. 인증이 완료되면 회원가입을 진행할 수 있습니다.
                </p>
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="verification-code"
                  inputMode="numeric"
                  placeholder="인증번호를 입력하세요"
                  className="h-[56px] rounded-[18px] border-transparent bg-[#eef3fb] pl-12 text-base shadow-none placeholder:text-[#7f8ba3]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="outline" className="h-[52px] rounded-[16px]" onClick={onBackToRoleSelect}>
                  처음부터 다시
                </Button>
                <Button type="button" size="lg" className="h-[52px] rounded-[16px] text-[1.02rem] shadow-[0_16px_34px_rgba(91,132,255,0.22)]">
                  회원가입
                </Button>
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-center text-sm text-foreground">
            이미 계정이 있나요?{" "}
            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-foreground transition-colors hover:text-primary">
              로그인하기
            </button>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
