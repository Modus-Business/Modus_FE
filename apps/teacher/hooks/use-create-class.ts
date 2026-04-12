"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherClassesApiClient } from "../lib/classes/client";
import type {
  ClassesResponseData,
  ClassParticipantsResponseData,
  CreateClassRequest,
  CreateClassResponseData,
  RegenerateClassCodeResponseData,
} from "../lib/classes/service";

type CreateClassPayload = {
  class: CreateClassResponseData;
};

type RegenerateClassCodePayload = {
  classCode: RegenerateClassCodeResponseData;
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

export function useRegenerateClassCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) =>
      (await teacherClassesApiClient.patch<RegenerateClassCodePayload>(`/api/classes/${encodeURIComponent(classId)}/code`)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-classes"] });
    },
  });
}

export function useClassParticipantsQuery(classId: string) {
  return useQuery({
    queryKey: ["teacher-class-participants", classId],
    queryFn: async () =>
      (await teacherClassesApiClient.get<{ participants: ClassParticipantsResponseData }>(`/api/classes/${encodeURIComponent(classId)}/participants`)).data.participants,
  });
}
