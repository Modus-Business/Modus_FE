import type { ChatMessage, GroupSummary, StudentClassroom } from "@modus/classroom-ui";

import type { ClassSummary } from "./service";

function createFallbackGroup(classroom: ClassSummary): GroupSummary | undefined {
  if (!classroom.myGroup || !classroom.myGroup.groupId || !classroom.myGroup.name) {
    return undefined;
  }

  return {
    id: classroom.myGroup.groupId,
    name: classroom.myGroup.name,
    topic: "",
    members: [],
    messages: [] as ChatMessage[],
  };
}

export function toStudentClassroom(classroom: ClassSummary): StudentClassroom {
  const group = createFallbackGroup(classroom);

  return {
    id: classroom.classId,
    name: classroom.name,
    code: classroom.classCode || "",
    schedule: "",
    description: classroom.description || "",
    track: "",
    nextSession: "",
    teamName: classroom.myGroup?.name || undefined,
    notices: [],
    assignments: [],
    group,
  };
}
