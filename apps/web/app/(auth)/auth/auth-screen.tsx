"use client";

import * as React from "react";
import { ArrowUpRight, ChevronLeft, GraduationCap, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";

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
  cn,
} from "@modus/classroom-ui";

type AuthMode = "login" | "signup";
type SignupRole = "student" | "teacher";

type AuthScreenProps = {
  initialMode?: AuthMode;
};

const layerClassName =
  "flex h-full min-h-full w-full items-center justify-center overflow-hidden p-3 sm:p-4 lg:absolute lg:inset-0 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:gap-5 lg:p-0 xl:gap-6";

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [signupRole, setSignupRole] = React.useState<SignupRole | null>(null);
  const [signupStep, setSignupStep] = React.useState<"role" | "profile" | "verify">("role");

  const openSignup = React.useCallback(() => {
    setMode("signup");
    setSignupRole(null);
    setSignupStep("role");
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
    <div className="relative h-full min-h-full overflow-hidden rounded-[28px] bg-[#eef3fb] sm:rounded-[32px]">
      <div
        aria-hidden={mode !== "login"}
        className={cn(
          layerClassName,
          mode === "login" ? "relative z-20 h-full min-h-full opacity-100" : "pointer-events-none absolute inset-0 z-10 opacity-0"
        )}
      >
        <LoginVisual active={mode === "login"} />
        <LoginCard active={mode === "login"} onSwitchToSignup={openSignup} />
      </div>

      <div
        aria-hidden={mode !== "signup"}
        className={cn(
          layerClassName,
          mode === "signup" ? "relative z-20 h-full min-h-full opacity-100" : "pointer-events-none absolute inset-0 z-10 opacity-0"
        )}
      >
        <SignupCard
          active={mode === "signup"}
          role={signupRole}
          step={signupStep}
          onBackToRoleSelect={() => {
            setSignupRole(null);
            setSignupStep("role");
          }}
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
    <section className="relative order-2 hidden min-h-[16rem] overflow-hidden rounded-[24px] border border-white/70 bg-white sm:min-h-[18rem] sm:rounded-[28px] lg:order-1 lg:block lg:h-full lg:min-h-0 lg:rounded-[34px]">
      <div
        className={cn(
          "absolute left-1/2 top-[58%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_68%_45%,#82a8ff_0%,#5b84ff_48%,#3f63d6_100%)] shadow-[0_20px_80px_rgba(91,132,255,0.28)] will-change-transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:h-[38rem] sm:w-[38rem] lg:-left-[50%] lg:top-1/2 lg:h-[860px] lg:w-[860px] lg:-translate-x-0 xl:-left-[46%] xl:h-[920px] xl:w-[920px]",
          active ? "translate-x-0 scale-100" : "translate-x-[12%] scale-[1.02]"
        )}
      />
      <div className="relative flex h-full items-end justify-center px-5 py-6 sm:px-7 sm:py-7 lg:items-center lg:justify-start lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-md text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-left",
            active ? "translate-x-0 opacity-100 delay-100" : "-translate-x-16 opacity-0"
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
          active ? "translate-x-0 scale-100" : "-translate-x-[12%] scale-[1.02]"
        )}
      />
      <div className="relative flex h-full items-end justify-center px-5 py-6 sm:px-7 sm:py-8 lg:items-center lg:justify-end lg:px-14 xl:px-20">
        <div
          className={cn(
            "max-w-md text-center text-white will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:text-right",
            active ? "translate-x-0 opacity-100 delay-100" : "translate-x-16 opacity-0"
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

function LoginCard({ active, onSwitchToSignup }: { active: boolean; onSwitchToSignup: () => void }) {
  return (
    <section className="order-1 flex min-h-fit w-full items-center justify-center px-1 py-4 sm:px-2 sm:py-5 lg:order-2 lg:h-full lg:rounded-[34px] lg:bg-white lg:px-8 lg:py-6">
      <div
        className={cn(
          "w-full max-w-[34rem] space-y-7 will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:space-y-8 lg:space-y-0",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "-translate-x-10 scale-[0.97] opacity-0"
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

            <form className="space-y-3.5 sm:space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  autoComplete="email"
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                />
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[58px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                />
              </div>

              <Button type="submit" size="lg" className="h-12 w-full rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[54px] sm:rounded-[16px] sm:text-[1.02rem]">
                Sign in
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
  role,
  step,
  onBackToRoleSelect,
  onProceedToVerify,
  onSelectRole,
  onSwitchToLogin,
}: {
  active: boolean;
  role: SignupRole | null;
  step: "role" | "profile" | "verify";
  onBackToRoleSelect: () => void;
  onProceedToVerify: () => void;
  onSelectRole: (role: SignupRole) => void;
  onSwitchToLogin: () => void;
}) {
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (step !== "verify") {
      setResetDialogOpen(false);
    }
  }, [step]);

  return (
    <section className="order-1 flex min-h-fit w-full items-center justify-center px-1 py-4 sm:px-2 sm:py-5 lg:h-full lg:rounded-[34px] lg:bg-white lg:px-8 lg:py-6">
      <div
        className={cn(
          "w-full max-w-[35rem] space-y-7 will-change-transform transition-[opacity,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:space-y-8 lg:space-y-0",
          active ? "translate-x-0 scale-100 opacity-100 delay-75" : "translate-x-10 scale-[0.97] opacity-0"
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
              <div className="flex flex-col gap-2 rounded-[18px] bg-[#f8faff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
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
                className="space-y-3.5 sm:space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  onProceedToVerify();
                }}
              >
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                  <Input
                    id="name"
                    placeholder="본명을 입력하세요"
                    autoComplete="name"
                    className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                  />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    autoComplete="email"
                    className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                  />
                </div>

                <Input
                  id="signup-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="new-password"
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:text-base"
                />

                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  autoComplete="new-password"
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:text-base"
                />

                <Button type="submit" size="lg" className="h-12 w-full rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[52px] sm:rounded-[16px] sm:text-[1.02rem]">
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
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-5" />
                <Input
                  id="verification-code"
                  inputMode="numeric"
                  placeholder="인증번호를 입력하세요"
                  className="h-[52px] rounded-[16px] border-transparent bg-[#eef3fb] pl-11 text-[15px] shadow-none placeholder:text-[#7f8ba3] sm:h-[56px] sm:rounded-[18px] sm:pl-12 sm:text-base"
                />
              </div>

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
                <Button type="button" size="lg" className="h-12 rounded-[15px] text-base shadow-[0_16px_34px_rgba(91,132,255,0.22)] sm:h-[52px] sm:rounded-[16px] sm:text-[1.02rem]">
                  회원가입
                </Button>
              </div>
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
