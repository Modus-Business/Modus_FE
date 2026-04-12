"use client";

import { useQuery } from "@tanstack/react-query";

import { teacherAssignmentsApiClient } from "../lib/assignments/client";
import type { AssignmentSubmissionStatusListResponseData } from "../lib/assignments/service";

export function useClassSubmissionStatusesQuery(classId: string) {
  return useQuery({
    queryKey: ["teacher-class-submissions", classId],
    queryFn: async () =>
      (await teacherAssignmentsApiClient.get<{ submissions: AssignmentSubmissionStatusListResponseData }>(`/api/assignments/submissions/class/${encodeURIComponent(classId)}`)).data.submissions,
  });
}
