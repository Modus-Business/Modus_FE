"use client";

import { useQuery } from "@tanstack/react-query";

import { studentMeApiClient } from "../lib/me/client";
import type { MeSettingsResponseData } from "../lib/me/service";

type MeSettingsPayload = {
  settings: MeSettingsResponseData;
};

export function useStudentSettingsQuery() {
  return useQuery({
    queryKey: ["student-settings"],
    queryFn: async () =>
      (await studentMeApiClient.get<MeSettingsPayload>("/api/me/settings")).data.settings,
  });
}
