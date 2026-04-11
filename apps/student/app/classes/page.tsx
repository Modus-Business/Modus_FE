"use client";

import * as React from "react";
import { ApiClientError, createAppBrowserClient } from "@modus/api-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { ClassCard, PageHeader, studentProfile } from "@modus/classroom-ui";

type MyGroupDto = {
  groupId: string | null;
  name: string | null;
};

type ClassSummaryDto = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string | null;
  studentCount: number | null;
  createdAt: string | null;
  myGroup: MyGroupDto | null;
};

type ClassesResponse = {
  classes: ClassSummaryDto[];
};

type ClassesQueryError = Error & {
  status?: number;
};

const appClient = createAppBrowserClient();

async function fetchClasses(): Promise<ClassesResponse> {
  try {
    const response = await appClient.get<ClassesResponse>("/api/classes");
    return response.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      const queryError = new Error(error.message) as ClassesQueryError;
      queryError.status = error.status;
      throw queryError;
    }

    throw error;
  }
}

export default function StudentClassesPage() {
  const { data, error, isLoading } = useQuery<ClassesResponse, ClassesQueryError>({
    queryKey: ["student-classes"],
    queryFn: fetchClasses,
  });

  React.useEffect(() => {
    if (!error) {
      return;
    }

    if (error.status === 401 || error.status === 403) {
      toast.error("수업 목록을 조회할 권한이 없습니다. 로그인 상태나 권한을 확인해 주세요.");
    }
  }, [error]);

  const classes = data?.classes ?? [];

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title="참여 중인 수업"
        description=""
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        showProfile={false}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-3 sm:p-5 lg:p-6">
        {isLoading ? (
          <div className="rounded-[28px] border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            수업 목록을 불러오는 중입니다.
          </div>
        ) : null}
        {!isLoading && error && error.status !== 401 && error.status !== 403 ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700">
            {error.message}
          </div>
        ) : null}
        {!isLoading && !error && classes.length === 0 ? (
          <div className="rounded-[28px] border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            아직 참여 중인 수업이 없습니다.
          </div>
        ) : null}
        {!isLoading && !error && classes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {classes.map((classroom) => (
              <ClassCard
                key={classroom.classId}
                href={`/class/${classroom.classId}`}
                name={classroom.name}
                description={classroom.description ?? ""}
                footerLabel={classroom.myGroup?.name ? "모둠" : "모둠 상태"}
                footerValue={classroom.myGroup?.name ?? "배정 전"}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
