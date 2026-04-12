"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { teacherGroupsApiClient } from "../lib/groups/client";
import type { CreateGroupRequest, CreateGroupResponseData, UpdateGroupRequest } from "../lib/groups/service";

type CreateGroupPayload = {
  group: CreateGroupResponseData;
};

type UpdateGroupPayload = {
  group: CreateGroupResponseData;
};

export function useCreateGroupMutation() {
  return useMutation({
    mutationFn: async (body: CreateGroupRequest) =>
      (await teacherGroupsApiClient.post<CreateGroupPayload>("/api/groups", body)).data,
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, body }: { groupId: string; body: UpdateGroupRequest }) =>
      (await teacherGroupsApiClient.patch<UpdateGroupPayload>(`/api/groups/${encodeURIComponent(groupId)}`, body)).data,
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-participants", data.group.classId] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-group-detail", variables.groupId] });
    },
  });
}
