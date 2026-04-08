import { BellRing, KeyRound, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, teacherProfile } from "@modus/classroom-ui";

export default function TeacherSettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="apps/teacher/settings"
        title="교강사 계정과 운영 옵션을 미리 정리합니다"
        description="프로필, 공지 기본값, 수업 코드 공유 정책 등 교강사 중심 설정 UI를 선행 퍼블리싱합니다."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
      />
      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필</CardTitle>
            <CardDescription>교강사명과 닉네임, 연락 이메일 노출 영역입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">실명</p><p className="text-sm">{teacherProfile.realName}</p></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">닉네임</p><p className="text-sm">{teacherProfile.nickname}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary" />공지 기본값</CardTitle>
            <CardDescription>중요 공지의 기본 문구와 우선순위 옵션을 배치합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">기본 태그</p><Badge className="mt-2">[필독]</Badge></div>
            <div className="border border-border/70 bg-background/80 p-4"><p className="text-sm font-medium text-foreground">공지 노출 범위</p><p className="text-sm">클래스 전체 / 모둠별 공지 흐름 확장 가능</p></div>
          </CardContent>
        </Card>
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="size-5 text-primary" />수업 코드 정책</CardTitle>
            <CardDescription>수업 코드 확인 영역과 만료/재생성 UI를 위한 자리입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-6 text-muted-foreground">
            <div className="border border-border/70 bg-background/80 p-4 text-sm">코드는 헤더와 우측 패널 모두에서 확인할 수 있도록 설계합니다.</div>
            <div className="border border-border/70 bg-background/80 p-4 text-sm">실제 로직 연결 전까지는 읽기 전용 상태와 액션 버튼만 제공합니다.</div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
