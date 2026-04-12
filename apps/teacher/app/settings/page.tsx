"use client";

import { BellRing, UserRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, teacherProfile } from "@modus/classroom-ui";

import { useTeacherSettingsQuery } from "../../hooks/use-settings";

export default function TeacherSettingsPage() {
  const settingsQuery = useTeacherSettingsQuery();
  const settings = settingsQuery.data;
  const isRoleMismatch = settings ? settings.role !== "teacher" : false;
  const displayName = settings?.name || teacherProfile.realName;
  const displayEmail = settings?.email || teacherProfile.email;

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title="계정 정보와 공지 설정을 한곳에서 확인할 수 있습니다"
        description="교강사 이름과 이메일, 공지 노출 범위를 확인하고 수업 운영에 필요한 기본 정보를 정리해 보세요."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-3 sm:p-5 lg:p-6">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필</CardTitle>
              <CardDescription>교강사 실명과 연락 이메일을 확인하는 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
              {settingsQuery.isLoading ? (
                <div className="border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">설정 정보를 불러오는 중입니다.</div>
              ) : null}
              {settingsQuery.isError ? (
                <div className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">설정 정보를 불러오지 못했습니다.</div>
              ) : null}
              {isRoleMismatch ? (
                <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">교강사 계정으로 로그인했는지 확인해 주세요.</div>
              ) : null}
              <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">실명</p><p className="text-sm">{displayName}</p></div>
              <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">이메일</p><p className="text-sm">{displayEmail}</p></div>
            </CardContent>
          </Card>
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />공지 기본값</CardTitle>
              <CardDescription>중요 공지의 기본 문구와 우선순위 옵션을 배치합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
              <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">공지 노출 범위</p><p className="text-sm">클래스 전체 / 모둠별 공지 흐름 확장 가능</p></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
