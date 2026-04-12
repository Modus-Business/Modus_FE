"use client";

import type { ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppShell, JoinClassDialog, type StudentClassroom } from "@modus/classroom-ui";

import { useJoinClassMutation } from "../hooks/use-classes";
import { useStudentMeQuery } from "../hooks/use-settings";

function readErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || "수업 참여에 실패했습니다.";
    }
  }

  return "수업 참여에 실패했습니다.";
}

export function StudentAppShell({
  children,
  initialStudentClassrooms,
}: {
  children: ReactNode;
  initialStudentClassrooms: StudentClassroom[];
}) {
  const router = useRouter();
  const meQuery = useStudentMeQuery();
  const joinClassMutation = useJoinClassMutation();
  const accountName = meQuery.data?.role === "student" ? meQuery.data.name : "";

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
              toast.error(readErrorMessage(error));
              throw error;
            }
          }}
        />
      }
    >
      {children}
    </AppShell>
  );
}
