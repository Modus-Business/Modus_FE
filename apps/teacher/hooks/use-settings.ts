"use client";

import { useQuery } from "@tanstack/react-query";

import { teacherMeApiClient } from "../lib/me/client";
import type { MeSettingsResponseData } from "../lib/me/service";

type MeSettingsPayload = {
  settings: MeSettingsResponseData;
};

export function useTeacherMeQuery() {
  return useQuery({
    queryKey: ["teacher-me"],
    queryFn: async () =>
      (await teacherMeApiClient.get<MeSettingsPayload>("/api/me/settings")).data.settings,
  });
}
