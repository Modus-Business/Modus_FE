"use client";

import type { ReactNode } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppShell, JoinClassDialog, type StudentClassroom } from "@modus/classroom-ui";

import { useJoinClassMutation } from "../hooks/use-classes";
import { useMySubmissionQuery, useSubmitAssignmentMutation } from "../hooks/use-assignment-submissions";
import { useStudentMeQuery } from "../hooks/use-settings";

function readErrorMessageWithFallback(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || fallback;
    }
  }

  return fallback;
}

export function StudentAppShell({
  children,
  initialStudentClassrooms,
}: {
  children: ReactNode;
  initialStudentClassrooms: StudentClassroom[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const meQuery = useStudentMeQuery();
  const joinClassMutation = useJoinClassMutation();
  const submitAssignmentMutation = useSubmitAssignmentMutation();
  const accountName = meQuery.data?.role === "student" ? meQuery.data.name : "";
  const studentClassroomMatch = pathname.match(/^\/class\/([^/]+)$/);
  const currentClassroom = studentClassroomMatch
    ? initialStudentClassrooms.find((classroom) => classroom.id === decodeURIComponent(studentClassroomMatch[1])) || null
    : null;
  const currentGroupId = currentClassroom?.group?.id || "";
  const mySubmissionQuery = useMySubmissionQuery(currentGroupId);
  const currentSubmission = mySubmissionQuery.data
    ? {
      submittedAt: new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(mySubmissionQuery.data.submittedAt)),
      fileDownloadUrl: mySubmissionQuery.data.fileUrl
        ? `/api/assignments/submissions/${encodeURIComponent(mySubmissionQuery.data.submissionId)}/download`
        : "",
      link: mySubmissionQuery.data.link || "",
    }
    : null;

  return (
    <AppShell
      role="student"
      accountName={accountName}
      studentClassroomsOverride={initialStudentClassrooms}
      studentJoinAction={
        <JoinClassDialog
          iconOnly
          pending={joinClassMutation.isPending}
          onSubmit={async ({ classCode }) => {
            try {
              await joinClassMutation.mutateAsync({ classCode });
              router.refresh();
              toast.success("수업에 참여했습니다.");
            } catch (error) {
              toast.error(readErrorMessageWithFallback(error, "수업 참여에 실패했습니다."));
              throw error;
            }
          }}
        />
      }
      studentSubmitAssignmentPending={submitAssignmentMutation.isPending}
      studentSubmissionLoading={Boolean(currentGroupId) && mySubmissionQuery.isLoading}
      studentCurrentSubmission={currentSubmission}
      onStudentSubmitAssignment={async ({ groupId, file, link }) => {
        try {
          await submitAssignmentMutation.mutateAsync({
            groupId,
            file,
            link,
          });
          toast.success("과제가 제출되었습니다.");
        } catch (error) {
          toast.error(readErrorMessageWithFallback(error, "과제 제출에 실패했습니다."));
          throw error;
        }
      }}
    >
      {children}
    </AppShell>
  );
}
