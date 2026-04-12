"use client";

import { useMutation } from "@tanstack/react-query";

import { teacherGroupsApiClient } from "../lib/groups/client";
import type { CreateGroupRequest, CreateGroupResponseData } from "../lib/groups/service";

type CreateGroupPayload = {
  group: CreateGroupResponseData;
};

export function useCreateGroupMutation() {
  return useMutation({
    mutationFn: async (body: CreateGroupRequest) =>
      (await teacherGroupsApiClient.post<CreateGroupPayload>("/api/groups", body)).data,
  });
}
