import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "../api/route";
import { getGroupDetail, type GroupDetailResponseData } from "./service";

export async function getStudentGroupDetailForRoute(groupId: string): Promise<GroupDetailResponseData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken || !groupId) {
    return null;
  }

  const result = await getGroupDetail(accessToken, groupId);

  if (!result.ok) {
    return null;
  }

  return result.data;
}
