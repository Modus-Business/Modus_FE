"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherClassesApiClient } from "../lib/classes/client";
import type { ClassesResponseData, CreateClassRequest, CreateClassResponseData } from "../lib/classes/service";

type CreateClassPayload = {
  class: CreateClassResponseData;
};

export function useCreateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateClassRequest) =>
      (await teacherClassesApiClient.post<CreateClassPayload>("/api/classes", body)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-classes"] });
    },
  });
}

export function useTeacherClassesQuery() {
  return useQuery({
    queryKey: ["teacher-classes"],
    queryFn: async () =>
      (await teacherClassesApiClient.get<ClassesResponseData>("/api/classes")).data,
  });
}
