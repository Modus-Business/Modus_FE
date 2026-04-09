import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersRound } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCodeDialog, EmptyState, getTeacherClassroom, NewNoticeDialog, NoticesDialog, PageHeader, teacherProfile } from "@modus/classroom-ui";

type TeacherClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function TeacherClassPage({ params }: TeacherClassPageProps) {
  const { classId } = await params;
  const classroom = getTeacherClassroom(classId);
  if (!classroom) notFound();

  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title={classroom.name}
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        actions={<><ClassCodeDialog classCode={classroom.code} /><NoticesDialog notices={classroom.notices} /><NewNoticeDialog /></>}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />

      <section className="bg-background/60 p-4 sm:p-5 lg:p-6">
          <Card className="bg-white/95">
            <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />모둠 현황</CardTitle>
                <CardDescription>각 모둠의 이름, 제출 여부, 구성원 수를 요약 카드로 보여줍니다.</CardDescription>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href={`/class/${classId}/groups`}>모둠 배치하기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {classroom.teams.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {classroom.teams.map((team) => (
                    <div key={team.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{team.name}</p>
                        <Badge variant={team.submissionStatus === "제출 완료" ? "success" : "warning"}>{team.submissionStatus}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">구성원 {team.memberIds.length}명</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="아직 생성된 모둠이 없습니다"
                  description="모둠 배치하기에서 새 모둠을 추가하고 학생을 배치해 수업 구성을 시작해 보세요."
                />
              )}
            </CardContent>
          </Card>
        </section>
    </div>
  );
}
