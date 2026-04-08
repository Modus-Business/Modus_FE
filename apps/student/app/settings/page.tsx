import { BellRing, ShieldCheck, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, studentProfile } from "@modus/classroom-ui";

export default function StudentSettingsPage() {
  return (
    <>
      <PageHeader
        title="프로필과 알림 옵션을 미리 정리합니다"
        description="실제 저장 로직 이전 단계에서, 학생에게 필요한 노출 범위와 알림 설정 UI를 퍼블리싱합니다."
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />알림 / 인증 준비 상태</CardTitle>
            <CardDescription>JWT / RFR, 이메일 인증은 이후 로직 연결을 위한 상태 UI만 제공합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">이메일 인증</p><Badge className="mt-2">인증 완료</Badge></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">토큰 세션</p><p className="text-sm">JWT + Refresh Token 구조를 사용할 예정</p></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="flex items-center gap-2 text-sm font-medium text-foreground"><ShieldCheck className="size-4 text-primary" />로그인 보안 안내</p><p className="mt-2 text-sm">로컬 로그인 기반 UI이며 실제 세션 연결 전 단계입니다.</p></div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
