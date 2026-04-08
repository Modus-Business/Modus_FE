import { notFound } from "next/navigation";
import { Hash, Users } from "lucide-react";

import {
  AssignmentSummaryDialog,
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
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

const memberAvatarStyles = [
  "bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#effbf6_0%,#d8f5e8_58%,#bfe9d8_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#fff4ee_0%,#ffe2d2_58%,#ffd0bb_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#f5f1ff_0%,#e4dbff_58%,#d3c7ff_100%)]",
];

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
            <AssignmentSummaryDialog assignments={classroom.assignments} />
            <NoticesDialog notices={classroom.notices} />
            <SubmitAssignmentDialog className={classroom.name} />
          </>
        }
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />

      {!classroom.group ? (
        <div>
          <EmptyState
            title="참여 중인 모둠이 없습니다"
            description="모둠 배정 전 클래스 화면입니다. 공지와 과제 확인은 가능하지만 채팅과 팀원 목록은 모둠이 생성된 뒤 활성화됩니다."
          />
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] xl:items-start">
          <div className="min-w-0">
            <GroupChat group={classroom.group} showHeader={false} />
          </div>

          <div className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <Card className="h-fit bg-white/95">
              <CardHeader className="border-b border-border/70">
                <CardTitle className="flex items-center gap-2"><Users className="size-5 text-primary" />모둠원 닉네임</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {classroom.group.members.map((member, index) => (
                  <div key={member.id} className="border-t border-border/70 bg-background/70 p-4 first:border-t-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 ring-2 ring-white/80">
                        <AvatarFallback
                          className={memberAvatarStyles[index % memberAvatarStyles.length]}
                          aria-hidden="true"
                        />
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{member.nickname}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-foreground"><Hash className="size-4 text-primary" />수업 코드 {classroom.code}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
