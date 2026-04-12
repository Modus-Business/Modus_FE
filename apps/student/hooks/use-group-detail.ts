"use client";

import { useQuery } from "@tanstack/react-query";

import { studentGroupsApiClient } from "../lib/groups/client";
import type { GroupDetailResponseData } from "../lib/groups/service";

type GroupDetailPayload = {
  group: GroupDetailResponseData;
};

export function useStudentGroupDetailQuery(groupId: string) {
  return useQuery({
    queryKey: ["student-group-detail", groupId],
    enabled: Boolean(groupId),
    queryFn: async () =>
      (await studentGroupsApiClient.get<GroupDetailPayload>(`/api/groups/${encodeURIComponent(groupId)}`)).data.group,
  });
}
