"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { studentAssignmentsApiClient } from "../lib/assignments/client";
import type {
  AssignmentSubmissionItemData,
  SubmitAssignmentRequest,
} from "../lib/assignments/service";

type SubmitAssignmentPayload = {
  submission: AssignmentSubmissionItemData;
};

type UploadFilePayload = {
  upload: {
    fileKey: string;
    fileUrl: string;
  };
};

type SubmitAssignmentMutationInput = {
  groupId: string;
  file?: File | null;
  link?: string;
};

export function useSubmitAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, file, link }: SubmitAssignmentMutationInput) => {
      const trimmedLink = link ? link.trim() : "";

      if (!groupId) {
        throw new Error("모둠 정보가 필요합니다.");
      }

      if (!file && !trimmedLink) {
        throw new Error("파일 또는 링크를 입력해 주세요.");
      }

      let uploadedFileUrl = "";

      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.set("file", file);
        uploadFormData.set("purpose", "assignments");
        const uploadResponse = await axios.post<UploadFilePayload>(
          "/api/storage/upload",
          uploadFormData,
          {
            withCredentials: true,
          },
        );
        uploadedFileUrl = uploadResponse.data.upload.fileUrl;
      }

      const requestBody: SubmitAssignmentRequest = {
        groupId,
      };

      if (uploadedFileUrl) {
        requestBody.fileUrl = uploadedFileUrl;
      }

      if (trimmedLink) {
        requestBody.link = trimmedLink;
      }

      return (await studentAssignmentsApiClient.post<SubmitAssignmentPayload>("/api/assignments/submissions", requestBody)).data;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["student-my-submission", variables.groupId] });
    },
  });
}

export function useMySubmissionQuery(groupId: string) {
  return useQuery({
    queryKey: ["student-my-submission", groupId],
    enabled: Boolean(groupId),
    queryFn: async () =>
      (await studentAssignmentsApiClient.get<{ submission: AssignmentSubmissionItemData | null }>(`/api/assignments/submissions/my/${encodeURIComponent(groupId)}`)).data.submission,
  });
}
