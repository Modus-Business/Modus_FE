"use client";

import { useQuery } from "@tanstack/react-query";

import { teacherGroupsApiClient } from "../lib/groups/client";
import type { GroupDetailResponseData } from "../lib/groups/service";

type GroupDetailPayload = {
  group: GroupDetailResponseData;
};

export function useGroupDetailQuery(groupId: string | null) {
  return useQuery({
    queryKey: ["teacher-group-detail", groupId],
    enabled: Boolean(groupId),
    queryFn: async () => {
      if (!groupId) {
        throw new Error("모둠 ID가 필요합니다.");
      }

      return (await teacherGroupsApiClient.get<GroupDetailPayload>(`/api/groups/${encodeURIComponent(groupId)}`)).data.group;
    },
  });
}
