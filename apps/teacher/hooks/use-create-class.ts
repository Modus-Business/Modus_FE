"use client";

import { useMutation } from "@tanstack/react-query";

import { teacherClassesApiClient } from "../lib/classes/client";
import type { CreateClassRequest, CreateClassResponseData } from "../lib/classes/service";

type CreateClassPayload = {
  class: CreateClassResponseData;
};

export function useCreateClassMutation() {
  return useMutation({
    mutationFn: async (body: CreateClassRequest) =>
      (await teacherClassesApiClient.post<CreateClassPayload>("/api/classes", body)).data,
  });
}
