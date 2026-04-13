import { notFound } from "next/navigation";

import {
  EmptyState,
  type GroupSummary,
} from "@modus/classroom-ui";
import { getStudentClassroomForRoute } from "../../../lib/classes/lookup";
import { getStudentGroupDetailForRoute } from "../../../lib/groups/lookup";
import { GroupMembersCard } from "./group-members-card";
import { StudentGroupChatPanelShell } from "./student-group-chat-panel-shell";

type StudentClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function StudentClassPage({ params }: StudentClassPageProps) {
  const { classId } = await params;
  const classroom = await getStudentClassroomForRoute(classId);
  if (!classroom) notFound();
  const groupDetail = classroom.group
    ? await getStudentGroupDetailForRoute(classroom.group.id)
    : null;
  const groupMembers = groupDetail?.members?.map((member) => ({
    id: member.groupMemberId,
    nickname: member.displayName,
    isMe: member.isMe,
  })) ?? classroom.group?.members.map((member) => ({
    id: member.id,
    nickname: member.nickname,
    isMe: false,
  })) ?? [];
  const groupMemberCount = groupDetail?.memberCount ?? groupMembers.length;

  return (
    <div className="-mx-2.5 -my-2.5 flex min-h-0 flex-1 flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      {!classroom.group ? (
        <div>
          <EmptyState
            title="참여 중인 모둠이 없습니다"
            description="모둠 배정 전 클래스 화면입니다. 공지와 과제 확인은 가능하지만 채팅과 팀원 목록은 모둠이 생성된 뒤 활성화됩니다."
          />
        </div>
      ) : (
        <section className="grid min-h-0 flex-1 gap-3 bg-background/40 p-3 sm:gap-4 sm:p-4 lg:p-5 xl:grid-cols-[minmax(0,1fr)_minmax(236px,264px)] xl:items-stretch xl:p-6">
          <div className="min-h-0 min-w-0 xl:h-[calc(100dvh-11rem)]">
            <StudentGroupChatPanelShell
              group={classroom.group as GroupSummary}
              className="h-full min-h-0"
            />
          </div>

          <div className="space-y-4 xl:sticky xl:top-24 xl:h-fit xl:self-start xl:justify-self-end">
            <GroupMembersCard
              members={groupMembers}
              memberCount={groupMemberCount}
              code={classroom.code}
              className="xl:w-[264px]"
            />
          </div>
        </section>
      )}
    </div>
  );
}
