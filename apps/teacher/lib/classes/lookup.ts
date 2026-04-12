import "server-only";

import { cookies } from "next/headers";

import { getTeacherClassroom, type TeacherClassroom } from "@modus/classroom-ui";

import { ACCESS_TOKEN_COOKIE } from "../api/route";
import { getClasses, type ClassSummary } from "./service";

function toTeacherClassroom(classroom: ClassSummary): TeacherClassroom {
  return {
    id: classroom.classId,
    name: classroom.name,
    code: classroom.classCode || "",
    schedule: "",
    description: classroom.description || "",
    cohort: "",
    teamCount: 0,
    studentCount: classroom.studentCount || 0,
    notices: [],
    roster: [],
    teams: [],
  };
}

export async function getTeacherClassroomForRoute(classId: string) {
  const mockClassroom = getTeacherClassroom(classId);

  if (mockClassroom) {
    return mockClassroom;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const result = await getClasses(accessToken);

  if (!result.ok) {
    return null;
  }

  const classroom = result.data.classes.find((item) => item.classId === classId);

  return classroom ? toTeacherClassroom(classroom) : null;
}
