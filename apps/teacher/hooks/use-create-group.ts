"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { teacherGroupsApiClient } from "../lib/groups/client";
import type {
  CreateGroupRequest,
  CreateGroupResponseData,
  DeleteGroupResponseData,
  UpdateGroupRequest,
} from "../lib/groups/service";

type CreateGroupPayload = {
  group: CreateGroupResponseData;
};

type UpdateGroupPayload = {
  group: CreateGroupResponseData;
};

type DeleteGroupPayload = {
  result: DeleteGroupResponseData;
};

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateGroupRequest) =>
      (await teacherGroupsApiClient.post<CreateGroupPayload>("/api/groups", body)).data,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-groups", variables.classId] });
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, body }: { groupId: string; body: UpdateGroupRequest }) =>
      (await teacherGroupsApiClient.patch<UpdateGroupPayload>(`/api/groups/${encodeURIComponent(groupId)}`, body)).data,
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-groups", data.group.classId] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-participants", data.group.classId] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-group-detail", variables.groupId] });
    },
  });
}

export function useDeleteGroupMutation(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) =>
      (await teacherGroupsApiClient.delete<DeleteGroupPayload>(`/api/groups/${encodeURIComponent(groupId)}`)).data,
    onSuccess: async (_data, groupId) => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-groups", classId] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-participants", classId] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-group-detail", groupId] });
    },
  });
}
