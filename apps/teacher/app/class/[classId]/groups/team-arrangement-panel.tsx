"use client";

import axios from "axios";
import { toast } from "sonner";

import { TeamArrangementBoard, type TeacherClassroom } from "@modus/classroom-ui";

import { useClassParticipantsQuery } from "../../../../hooks/use-create-class";
import { useCreateGroupMutation, useDeleteGroupMutation, useUpdateGroupMutation } from "../../../../hooks/use-create-group";
import type { ClassParticipantItem } from "../../../../lib/classes/service";

type TeamArrangementPanelProps = {
  classroom: TeacherClassroom;
};

function readErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || "모둠 요청에 실패했습니다.";
    }
  }

  return "모둠 요청에 실패했습니다.";
}

function buildClassroomFromParticipants(
  classroom: TeacherClassroom,
  participants: ClassParticipantItem[],
): TeacherClassroom {
  const teamsById = new Map<string, TeacherClassroom["teams"][number]>();

  for (const participant of participants) {
    const groupId = participant.group?.groupId;
    const groupName = participant.group?.name;

    if (!groupId || !groupName) {
      continue;
    }

    const currentTeam = teamsById.get(groupId);

    if (currentTeam) {
      currentTeam.memberIds.push(participant.studentId);
      continue;
    }

    teamsById.set(groupId, {
      id: groupId,
      name: groupName,
      theme: "API",
      memberIds: [participant.studentId],
      submissionStatus: "제출 미완료",
    });
  }

  return {
    ...classroom,
    roster: participants.map((participant) => ({
      id: participant.studentId,
      nickname: participant.nickname || "",
      realName: participant.studentName,
      email: participant.email,
      status: "online",
      roleLabel: "수강생",
    })),
    teams: Array.from(teamsById.values()),
  };
}

export function TeamArrangementPanel({ classroom }: TeamArrangementPanelProps) {
  const participantsQuery = useClassParticipantsQuery(classroom.id);
  const createGroupMutation = useCreateGroupMutation();
  const updateGroupMutation = useUpdateGroupMutation();
  const deleteGroupMutation = useDeleteGroupMutation(classroom.id);
  const boardClassroom = participantsQuery.data
    ? buildClassroomFromParticipants(classroom, participantsQuery.data.participants)
    : classroom;

  return (
    <TeamArrangementBoard
      classroom={boardClassroom}
      createGroupPending={createGroupMutation.isPending}
      updateGroupPending={updateGroupMutation.isPending}
      deleteGroupPending={deleteGroupMutation.isPending}
      onCreateGroup={async ({ name }) => {
        try {
          const response = await createGroupMutation.mutateAsync({
            classId: classroom.id,
            name,
          });
          toast.success("모둠이 생성되었습니다.");
          return {
            id: response.group.groupId,
            name: response.group.name,
            memberCount: response.group.memberCount,
          };
        } catch (error) {
          toast.error(readErrorMessage(error));
          throw error;
        }
      }}
      onUpdateGroup={async ({ groupId, name, studentIds }) => {
        try {
          await updateGroupMutation.mutateAsync({
            groupId,
            body: {
              name,
              studentIds,
            },
          });
          toast.success("모둠이 수정되었습니다.");
        } catch (error) {
          toast.error(readErrorMessage(error));
          throw error;
        }
      }}
      onDeleteGroup={async ({ groupId }) => {
        try {
          await deleteGroupMutation.mutateAsync(groupId);
          toast.success("모둠이 삭제되었습니다.");
        } catch (error) {
          toast.error(readErrorMessage(error));
          throw error;
        }
      }}
    />
  );
}
