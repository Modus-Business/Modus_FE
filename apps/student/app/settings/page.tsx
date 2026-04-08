import { BellRing, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, studentProfile } from "@modus/classroom-ui";

export default function StudentSettingsPage() {
  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title="프로필과 알림 옵션을 미리 정리합니다"
        description="실제 저장 로직 이전 단계에서, 학생에게 필요한 노출 범위와 알림 설정 UI를 퍼블리싱합니다."
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        className="border-b-0 px-6 py-6 lg:px-8 lg:py-7"
      />
      <section className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필 공개 설정</CardTitle>
            <CardDescription>닉네임은 전체 공개, 본명은 교강사에게만 보이도록 설계합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">닉네임</p><p className="text-sm">{studentProfile.nickname}</p></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">본명</p><p className="text-sm">{studentProfile.realName}</p><Badge variant="secondary" className="mt-2">교강사만 보기</Badge></div>
          </CardContent>
        </Card>
        <Card className="border-t border-border/70 bg-white/95 xl:border-l-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />알림 / 인증 준비 상태</CardTitle>
            <CardDescription>JWT / RFR, 이메일 인증은 이후 로직 연결을 위한 상태 UI만 제공합니다.</CardDescription>
          </CardHeader>
          <CardContent className="text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">이메일 인증</p><Badge className="mt-2">인증 완료</Badge></div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
