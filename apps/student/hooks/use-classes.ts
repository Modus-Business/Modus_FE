"use client";

import { useMutation } from "@tanstack/react-query";

import { studentClassesApiClient } from "../lib/classes/client";
import type {
  JoinClassRequest,
  JoinClassResponseData,
} from "../lib/classes/service";

type JoinClassPayload = {
  class: JoinClassResponseData;
};

export function useJoinClassMutation() {
  return useMutation({
    mutationFn: async (body: JoinClassRequest) =>
      (await studentClassesApiClient.post<JoinClassPayload>("/api/classes/join", body)).data,
  });
}
