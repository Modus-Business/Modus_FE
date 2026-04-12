"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherNoticesApiClient } from "../lib/notices/client";
import type {
  CreateNoticeRequest,
  DeleteNoticeResponseData,
  NoticeItemResponseData,
  NoticeListResponseData,
  UpdateNoticeRequest,
} from "../lib/notices/service";

type CreateNoticePayload = {
  notice: NoticeItemResponseData;
};

type UpdateNoticePayload = {
  notice: NoticeItemResponseData;
};

type DeleteNoticePayload = {
  result: DeleteNoticeResponseData;
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

export function useUpdateNoticeMutation(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noticeId, body }: { noticeId: string; body: UpdateNoticeRequest }) =>
      (await teacherNoticesApiClient.patch<UpdateNoticePayload>(`/api/notices/${encodeURIComponent(noticeId)}`, body)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-notices", classId] });
    },
  });
}

export function useDeleteNoticeMutation(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeId: string) =>
      (await teacherNoticesApiClient.delete<DeleteNoticePayload>(`/api/notices/${encodeURIComponent(noticeId)}`)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-class-notices", classId] });
    },
  });
}
