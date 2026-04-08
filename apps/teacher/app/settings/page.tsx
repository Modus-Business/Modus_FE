import { BellRing, UserRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, teacherProfile } from "@modus/classroom-ui";

export default function TeacherSettingsPage() {
  return (
    <>
      <PageHeader
        title="계정 정보와 공지 설정을 한곳에서 확인할 수 있습니다"
        description="교강사 이름과 이메일, 공지 노출 범위를 확인하고 수업 운영에 필요한 기본 정보를 정리해 보세요."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
      />
      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필</CardTitle>
            <CardDescription>교강사 실명과 연락 이메일을 확인하는 영역입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">실명</p><p className="text-sm">{teacherProfile.realName}</p></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">이메일</p><p className="text-sm">{teacherProfile.email}</p></div>
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
      </section>
    </>
  );
}
