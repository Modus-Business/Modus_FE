import { notFound } from "next/navigation";
import { Bell, Flag, Hash, Users } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  getStudentClassroom,
  GroupChat,
  NoticesDialog,
  PageHeader,
  studentProfile,
  SubmitAssignmentDialog,
} from "@modus/classroom-ui";

type StudentClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function StudentClassPage({ params }: StudentClassPageProps) {
  const { classId } = await params;
  const classroom = getStudentClassroom(classId);
  if (!classroom) notFound();

  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title={classroom.group ? `${classroom.group.name} 전체 채팅` : classroom.name}
        description={
          classroom.group
            ? classroom.group.topic
            : `${classroom.name} · ${classroom.schedule} · ${classroom.description}`
        }
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        actions={
          <>
            <NoticesDialog notices={classroom.notices} />
            <SubmitAssignmentDialog className={classroom.name} />
          </>
        }
        className="border-b-0 px-6 py-6 lg:px-8 lg:py-7"
      />

      {!classroom.group ? (
        <div>
          <EmptyState
            title="참여되있는 모둠이 없습니다"
            description="모둠 배정 전 클래스 화면입니다. 공지와 과제 확인은 가능하지만 채팅과 팀원 목록은 모둠이 생성된 뒤 활성화됩니다."
          />
        </div>
      ) : (
        <section className="grid gap-0 xl:grid-cols-[minmax(0,1.65fr)_300px]">
          <div className="space-y-0">
            <GroupChat group={classroom.group} showHeader={false} />
            <div className="grid gap-0 lg:grid-cols-2">
              <Card className="bg-white/95">
                <CardHeader className="border-b border-border/70">
                  <CardTitle className="flex items-center gap-2"><Flag className="size-5 text-primary" />모둠 과제</CardTitle>
                  <CardDescription>모둠마다 우측 상단 제출 버튼을 두는 흐름을 반영했습니다.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {classroom.assignments.map((assignment) => (
                    <div key={assignment.id} className="border-t border-border/70 bg-background/80 p-4 first:border-t-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{assignment.title}</p>
                        <Badge variant={assignment.status === "제출 전" ? "warning" : "secondary"}>{assignment.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">마감 · {assignment.dueAt}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-t border-border/70 bg-white/95 lg:border-t lg:border-l-0">
                <CardHeader className="border-b border-border/70">
                  <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-primary" />공지 요약</CardTitle>
                  <CardDescription>공지 버튼 팝업과 함께, 화면 안에서도 최신 공지를 빠르게 읽습니다.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {classroom.notices.slice(0, 2).map((notice) => (
                    <div key={notice.id} className="border-t border-border/70 bg-white p-4 first:border-t-0">
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

          <div className="space-y-0 xl:sticky xl:top-24 xl:h-fit">
            <Card className="h-fit border-t border-border/70 bg-white/95 xl:border-t xl:border-l-0">
              <CardHeader className="border-b border-border/70">
                <CardTitle className="flex items-center gap-2"><Users className="size-5 text-primary" />모둠원 닉네임</CardTitle>
                <CardDescription>오른쪽 멤버 영역은 고정 폭으로 두고, 대화 화면을 메인으로 강조합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {classroom.group.members.map((member) => (
                  <div key={member.id} className="border-t border-border/70 bg-background/70 p-4 first:border-t-0">
                    <div>
                      <p className="font-medium text-foreground">{member.nickname}</p>
                      <p className="text-sm text-muted-foreground">{member.roleLabel}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground"><Hash className="size-4 text-primary" />수업 코드 {classroom.code}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
