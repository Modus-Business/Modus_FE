"use client";

import axios from "axios";
import { toast } from "sonner";

import { ClassCodeDialog } from "@modus/classroom-ui";

import { useRegenerateClassCodeMutation } from "../../../hooks/use-create-class";

type ClassCodeActionProps = {
  classId: string;
  classCode: string;
};

function readErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || "수업 코드 재발급에 실패했습니다.";
    }
  }

  return "수업 코드 재발급에 실패했습니다.";
}

export function ClassCodeAction({ classId, classCode }: ClassCodeActionProps) {
  const regenerateClassCodeMutation = useRegenerateClassCodeMutation();

  return (
    <ClassCodeDialog
      classCode={classCode}
      pending={regenerateClassCodeMutation.isPending}
      onRegenerate={async () => {
        try {
          const response = await regenerateClassCodeMutation.mutateAsync(classId);
          toast.success("수업 코드가 재발급되었습니다.");
          return response.classCode.classCode;
        } catch (error) {
          toast.error(readErrorMessage(error));
          throw error;
        }
      }}
    />
  );
}
