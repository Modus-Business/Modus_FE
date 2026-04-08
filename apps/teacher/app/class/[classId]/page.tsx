import { notFound } from "next/navigation";
import { UsersRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCodeDialog, getTeacherClassroom, NewNoticeDialog, NoticesDialog, PageHeader, teacherProfile } from "@modus/classroom-ui";

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
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        actions={<><ClassCodeDialog classCode={classroom.code} /><NoticesDialog notices={classroom.notices} /><NewNoticeDialog /></>}
      />

      <section>
        <div>
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />모둠 현황</CardTitle>
              <CardDescription>각 모둠의 이름, 제출 여부, 구성원 수를 요약 카드로 보여줍니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {classroom.teams.map((team) => (
                <div key={team.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{team.name}</p>
                    <Badge variant={team.submissionStatus === "제출 완료" ? "success" : "warning"}>{team.submissionStatus}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">구성원 {team.members}명</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
