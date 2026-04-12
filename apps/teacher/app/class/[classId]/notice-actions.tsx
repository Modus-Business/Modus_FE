"use client";

import axios from "axios";
import { toast } from "sonner";

import { NewNoticeDialog, NoticesDialog, type NoticeItem } from "@modus/classroom-ui";

import {
  useClassNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} from "../../../hooks/use-create-notice";
import type { NoticeItemResponseData } from "../../../lib/notices/service";

type NoticeActionsProps = {
  classId: string;
  initialNotices: NoticeItem[];
};

function readErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || "공지 요청에 실패했습니다.";
    }
  }

  return "공지 요청에 실패했습니다.";
}

function formatNoticeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toNoticeItem(notice: NoticeItemResponseData): NoticeItem {
  return {
    id: notice.noticeId,
    title: notice.title,
    date: formatNoticeDate(notice.createdAt),
    summary: notice.content,
    content: notice.content,
  };
}

export function NoticeActions({ classId, initialNotices }: NoticeActionsProps) {
  const noticesQuery = useClassNoticesQuery(classId);
  const createNoticeMutation = useCreateNoticeMutation();
  const updateNoticeMutation = useUpdateNoticeMutation(classId);
  const deleteNoticeMutation = useDeleteNoticeMutation(classId);
  const notices = noticesQuery.data ? noticesQuery.data.notices.map(toNoticeItem) : initialNotices;

  return (
    <>
      <NoticesDialog
        notices={notices}
        detailTitlePrefix="공지"
        allowManage
        updatePending={updateNoticeMutation.isPending}
        deletePending={deleteNoticeMutation.isPending}
        onUpdate={async (payload) => {
          try {
            await updateNoticeMutation.mutateAsync({
              noticeId: payload.id,
              body: {
                title: payload.title,
                content: payload.content,
              },
            });
            toast.success("공지사항이 수정되었습니다.");
          } catch (error) {
            toast.error(readErrorMessage(error));
            throw error;
          }
        }}
        onDelete={async (noticeId) => {
          try {
            await deleteNoticeMutation.mutateAsync(noticeId);
            toast.success("공지사항이 삭제되었습니다.");
          } catch (error) {
            toast.error(readErrorMessage(error));
            throw error;
          }
        }}
      />
      <NewNoticeDialog
        pending={createNoticeMutation.isPending}
        onSubmit={async (payload) => {
          try {
            await createNoticeMutation.mutateAsync({
              classId,
              title: payload.title,
              content: payload.content,
            });
            toast.success("공지사항이 작성되었습니다.");
          } catch (error) {
            toast.error(readErrorMessage(error));
            throw error;
          }
        }}
      />
    </>
  );
}
