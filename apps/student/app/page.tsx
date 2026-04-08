import Link from "next/link";
import { ArrowRight, Bell, BookOpenText, Layers3 } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCard, JoinClassDialog, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentHomePage() {
  return (
    <>
      <PageHeader
        eyebrow="apps/student"
        title="참여 중인 수업과 오늘 할 일을 한 번에 확인해요"
        description="student 앱은 수업 참여, 모둠 화면, 과제 제출 흐름을 독립된 앱으로 구성합니다."
        profileName={studentProfile.realName}
        profileDescriptor={studentProfile.descriptor}
        actions={<JoinClassDialog />}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers3 className="size-5 text-primary" />참여 중인 수업</CardTitle>
            <CardDescription>본인이 등록한 수업과 다음 세션, 모둠 배정 상태를 빠르게 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {studentClassrooms.map((classroom) => (
              <ClassCard
                key={classroom.id}
                href={`/class/${classroom.id}`}
                name={classroom.name}
                code={classroom.code}
                schedule={classroom.schedule}
                description={classroom.description}
                metaLabel="다음 수업"
                metaValue={classroom.nextSession}
                footerLabel={classroom.teamName ? "내 모둠" : "모둠 상태"}
                footerValue={classroom.teamName ?? "배정 전"}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpenText className="size-5 text-primary" />오늘의 체크포인트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["모둠 과제 2차 시안 링크 정리", "공지 팝업의 정보 우선순위 검토", "헤더 수업 참여 플로우 문구 보완"].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl bg-background/80 p-4">
                  <Badge variant={index === 0 ? "default" : "secondary"}>{index + 1}</Badge>
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-primary" />최근 공지</CardTitle>
                <CardDescription>중요 공지를 놓치지 않도록 홈에 요약합니다.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/classes">전체 보기<ArrowRight className="size-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentClassrooms[0].notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{notice.title}</p>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
