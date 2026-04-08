import { notFound } from "next/navigation";
import { Bell, Flag, Hash, Users } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, getStudentClassroom, GroupChat, NoticesDialog, PageHeader, studentProfile, SubmitAssignmentDialog } from "@modus/classroom-ui";

type StudentClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function StudentClassPage({ params }: StudentClassPageProps) {
  const { classId } = await params;
  const classroom = getStudentClassroom(classId);
  if (!classroom) notFound();

  return (
    <>
      <PageHeader
        title={classroom.group ? classroom.group.name : classroom.name}
        description={`${classroom.name} · ${classroom.schedule} · ${classroom.description}`}
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        actions={<><NoticesDialog notices={classroom.notices} /><SubmitAssignmentDialog className={classroom.name} /></>}
      />

      {!classroom.group ? (
        <EmptyState
          title="참여되있는 모둠이 없습니다"
          description="모둠 배정 전 클래스 화면입니다. 공지와 과제 확인은 가능하지만 채팅과 팀원 목록은 모둠이 생성된 뒤 활성화됩니다."
        />
      ) : (
        <section className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_330px]">
          <div className="space-y-3">
            <GroupChat group={classroom.group} />
            <div className="grid gap-3 lg:grid-cols-2">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Flag className="size-5 text-primary" />모둠 과제</CardTitle>
                  <CardDescription>모둠마다 우측 상단 제출 버튼을 두는 흐름을 반영했습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {classroom.assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-border/70 bg-background/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{assignment.title}</p>
                        <Badge variant={assignment.status === "제출 전" ? "warning" : "secondary"}>{assignment.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">마감 · {assignment.dueAt}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-primary" />공지 요약</CardTitle>
                  <CardDescription>공지 버튼 팝업과 함께, 화면 안에서도 최신 공지를 빠르게 읽습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {classroom.notices.slice(0, 2).map((notice) => (
                    <div key={notice.id} className="border border-border/70 bg-white p-4">
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
          </div>

          <Card className="h-fit bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="size-5 text-primary" />모둠원 닉네임</CardTitle>
              <CardDescription>오른쪽 사이드바에는 모둠원의 닉네임과 역할을 배치합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {classroom.group.members.map((member) => (
                <div key={member.id} className="border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{member.nickname}</p>
                      <p className="text-sm text-muted-foreground">{member.roleLabel}</p>
                    </div>
                    <Badge variant={member.status === "online" ? "success" : member.status === "focus" ? "default" : "outline"}>{member.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">본명: {member.realName}</p>
                </div>
              ))}
              <div className="border border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-medium text-foreground"><Hash className="size-4 text-primary" />수업 코드 {classroom.code}</p>
                <p className="mt-2">수업 참여 다이얼로그에서 동일한 코드를 입력하는 흐름을 가정합니다.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
