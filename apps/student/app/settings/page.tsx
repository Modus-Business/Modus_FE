import { BellRing, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, studentProfile } from "@modus/classroom-ui";

export default function StudentSettingsPage() {
  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title="설정"
        description=""
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        showProfile={false}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />프로필 정보</CardTitle>
            <CardDescription>닉네임은 각 수업의 모둠마다 지정되고, 본명은 교강사에게만 보입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-lg border border-border/70 bg-background/80 p-4">
              <p className="text-sm font-medium text-foreground">본명</p>
              <p className="mt-1 text-base font-semibold text-foreground">{studentProfile.realName}</p>
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
              <Badge className="mt-2">인증 완료</Badge>
              <p className="mt-3 text-xs text-muted-foreground">현재 계정은 이메일 인증이 완료된 상태예요.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
