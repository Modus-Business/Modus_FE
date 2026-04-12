"use client";

import { useQuery } from "@tanstack/react-query";

import { studentNoticesApiClient } from "../lib/notices/client";
import type { NoticeListResponseData } from "../lib/notices/service";

export function useStudentClassNoticesQuery(classId: string) {
  return useQuery({
    queryKey: ["student-class-notices", classId],
    enabled: Boolean(classId),
    queryFn: async () =>
      (await studentNoticesApiClient.get<NoticeListResponseData>(`/api/notices/class/${encodeURIComponent(classId)}`)).data,
  });
}
