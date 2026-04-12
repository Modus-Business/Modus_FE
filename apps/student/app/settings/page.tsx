"use client";

import { BellRing, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, studentProfile } from "@modus/classroom-ui";

import { useStudentSettingsQuery } from "../../hooks/use-settings";

export default function StudentSettingsPage() {
  const settingsQuery = useStudentSettingsQuery();
  const settings = settingsQuery.data;
  const isRoleMismatch = settings ? settings.role !== "student" : false;
  const displayName = settings?.name || studentProfile.realName;
  const isEmailVerified = settings?.isEmailVerified || false;

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title="설정"
        description=""
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        showProfile={false}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="grid gap-3 bg-background/60 p-3 sm:gap-4 sm:p-5 lg:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필 정보</CardTitle>
            <CardDescription>닉네임은 각 수업의 모둠마다 지정되고, 본명은 교강사에게만 보입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            {settingsQuery.isLoading ? (
              <div className="rounded-lg border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                설정 정보를 불러오는 중입니다.
              </div>
            ) : null}
            {settingsQuery.isError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                설정 정보를 불러오지 못했습니다.
              </div>
            ) : null}
            {isRoleMismatch ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                수강생 계정으로 로그인했는지 확인해 주세요.
              </div>
            ) : null}
            <div className="rounded-lg border border-border/70 bg-background/80 p-4">
              <p className="text-sm font-medium text-foreground">본명</p>
              <p className="mt-1 text-base font-semibold text-foreground">{displayName}</p>
              <Badge variant="secondary" className="mt-2">교강사만 보기</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />인증 상태</CardTitle>
            <CardDescription>계정 인증 상태를 간단히 확인할 수 있어요.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            <div className="rounded-lg border border-border/70 bg-background/80 p-4">
              <p className="text-sm font-medium text-foreground">이메일 인증</p>
              <Badge variant={isEmailVerified ? "default" : "warning"} className="mt-2">
                {isEmailVerified ? "인증 완료" : "인증 필요"}
              </Badge>
              <p className="mt-3 text-xs text-muted-foreground">
                {isEmailVerified
                  ? "현재 계정은 이메일 인증이 완료된 상태예요."
                  : "현재 계정은 이메일 인증이 필요합니다."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
