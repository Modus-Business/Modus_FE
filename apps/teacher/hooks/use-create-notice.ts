"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherNoticesApiClient } from "../lib/notices/client";
import type { CreateNoticeRequest, NoticeItemResponseData, NoticeListResponseData } from "../lib/notices/service";

type CreateNoticePayload = {
  notice: NoticeItemResponseData;
};

export function useCreateNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateNoticeRequest) =>
      (await teacherNoticesApiClient.post<CreateNoticePayload>("/api/notices", body)).data,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-notices", variables.classId] });
    },
  });
}

export function useClassNoticesQuery(classId: string) {
  return useQuery({
    queryKey: ["teacher-class-notices", classId],
    queryFn: async () =>
      (await teacherNoticesApiClient.get<NoticeListResponseData>(`/api/notices/class/${encodeURIComponent(classId)}`)).data,
  });
}
