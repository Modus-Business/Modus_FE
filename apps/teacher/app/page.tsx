import Link from "next/link";
import { ArrowRight, Bell, LayoutTemplate, UsersRound } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCard, CreateClassDialog, PageHeader, teacherClassrooms, teacherProfile } from "@modus/classroom-ui";

export default function TeacherHomePage() {
  return (
    <>
      <PageHeader
        eyebrow="apps/teacher"
        title="운영 중인 수업과 공지 흐름을 한 화면에서 관리합니다"
        description="teacher 앱은 수업 생성, 수업 코드 확인, 공지 작성, 모둠 현황 관리에 초점을 맞춥니다."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        actions={<CreateClassDialog />}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LayoutTemplate className="size-5 text-primary" />내가 만든 수업</CardTitle>
            <CardDescription>생성한 클래스와 코호트, 팀 수를 홈 화면에서 바로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {teacherClassrooms.map((classroom) => (
              <ClassCard
                key={classroom.id}
                href={`/class/${classroom.id}`}
                name={classroom.name}
                code={classroom.code}
                schedule={classroom.schedule}
                description={classroom.description}
                metaLabel="학생 수"
                metaValue={`${classroom.studentCount}명`}
                footerLabel="모둠 수"
                footerValue={`${classroom.teamCount}팀`}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />운영 메모</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <div className="rounded-3xl bg-background/80 p-4">오늘은 모둠별 화면 구조와 공지 전달 흐름을 우선 확인합니다.</div>
              <div className="rounded-3xl bg-background/80 p-4">수업 코드 노출 위치는 헤더/사이드 패널 둘 다 후보로 확인합니다.</div>
              <div className="rounded-3xl bg-background/80 p-4">새 공지사항 작성 버튼은 클래스 화면 우측 상단에 배치합니다.</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-primary" />최근 공지</CardTitle>
                <CardDescription>교강사 홈에서도 최신 공지 흐름을 요약합니다.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm"><Link href="/classes">전체 보기<ArrowRight className="size-4" /></Link></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacherClassrooms[0].notices.slice(0, 3).map((notice) => (
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
