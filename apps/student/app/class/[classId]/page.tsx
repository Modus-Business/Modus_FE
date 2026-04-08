import { notFound } from "next/navigation";

import {
  AssignmentSummaryDialog,
  EmptyState,
  getStudentClassroom,
  GroupChat,
  NoticesDialog,
  PageHeader,
  studentProfile,
  SubmitAssignmentDialog,
} from "@modus/classroom-ui";
import { GroupMembersCard } from "./group-members-card";

type StudentClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function StudentClassPage({ params }: StudentClassPageProps) {
  const { classId } = await params;
  const classroom = getStudentClassroom(classId);
  if (!classroom) notFound();

  return (
    <div className="-mx-3 -my-3 flex min-h-0 flex-1 flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
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
        <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(236px,264px)] xl:items-stretch">
          <div className="min-h-0 min-w-0">
            <GroupChat group={classroom.group} showHeader={false} className="h-full min-h-0" />
          </div>

          <div className="space-y-4 xl:sticky xl:top-24 xl:h-fit xl:self-start xl:justify-self-end">
            <GroupMembersCard members={classroom.group.members} code={classroom.code} className="xl:w-[264px]" />
          </div>
        </section>
      )}
    </div>
  );
}
