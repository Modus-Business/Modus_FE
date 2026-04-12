import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "../api/route";
import { toStudentClassroom } from "./mapper";
import { getClasses } from "./service";

export async function getStudentClassroomsForApp() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return [];
  }

  const result = await getClasses(accessToken);

  if (!result.ok) {
    return [];
  }

  return result.data.classes.map(toStudentClassroom);
}

export async function getStudentClassroomForRoute(classId: string) {
  const classrooms = await getStudentClassroomsForApp();
  return classrooms.find((classroom) => classroom.id === classId) || null;
}
