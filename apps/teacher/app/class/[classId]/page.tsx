import { notFound } from "next/navigation";
import { Bell, Hash, UsersRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, CreateClassDialog, getTeacherClassroom, NewNoticeDialog, NoticesDialog, PageHeader, teacherProfile } from "@modus/classroom-ui";

type TeacherClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function TeacherClassPage({ params }: TeacherClassPageProps) {
  const { classId } = await params;
  const classroom = getTeacherClassroom(classId);
  if (!classroom) notFound();

  return (
    <>
      <PageHeader
        title={classroom.name}
        description={`${classroom.schedule} · ${classroom.description}`}
        profileName={teacherProfile.nickname}
        profileDescriptor={teacherProfile.descriptor}
        actions={<><NoticesDialog notices={classroom.notices} /><NewNoticeDialog /></>}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,360px)] xl:items-start">
        <div className="space-y-4">
          <Card className="bg-white/95">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-primary" />공지사항 작성 / 관리</CardTitle>
                <CardDescription>모둠 화면(교강사)에서는 공지사항 작성이 최우선 액션입니다.</CardDescription>
              </div>
              <CreateClassDialog />
            </CardHeader>
            <CardContent className="space-y-3">
              {classroom.notices.map((notice) => (
                <div key={notice.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{notice.title}</p>
                      {notice.pinned ? <Badge>고정</Badge> : null}
                    </div>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />모둠 현황</CardTitle>
              <CardDescription>각 모둠의 테마와 제출 상태를 요약 카드로 보여줍니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {classroom.teams.map((team) => (
                <div key={team.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{team.name}</p>
                    <Badge variant={team.submissionStatus === "확인 완료" ? "success" : team.submissionStatus === "검토 중" ? "default" : "warning"}>{team.submissionStatus}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">테마 · {team.theme}</p>
                  <p className="mt-1 text-sm text-muted-foreground">구성원 {team.members}명</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="h-fit bg-white/95 xl:sticky xl:top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hash className="size-5 text-primary" />수업 코드 확인</CardTitle>
            <CardDescription>교강사는 클래스 헤더와 우측 패널에서 수업 코드를 바로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <div className="rounded-[28px] border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Class Code</p>
              <p className="mt-2 break-all text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{classroom.code}</p>
            </div>
            <div className="rounded-3xl bg-background/80 p-4"><p className="font-medium text-foreground">학생 수</p><p>{classroom.studentCount}명</p></div>
            <div className="rounded-3xl bg-background/80 p-4"><p className="font-medium text-foreground">모둠 수</p><p>{classroom.teamCount}팀</p></div>
            <div className="rounded-3xl bg-background/80 p-4"><p className="font-medium text-foreground">운영 메모</p><p>공지사항 팝업과 새 공지 작성 버튼을 우측 상단 액션으로 유지합니다.</p></div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
