"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { ClassCard, CreateClassDialog, PageHeader, teacherClassrooms, teacherProfile } from "@modus/classroom-ui";

import { useCreateClassMutation } from "../../hooks/use-create-class";
import type { CreateClassResponseData } from "../../lib/classes/service";

type ClassCardItem = {
  id: string;
  href: string;
  name: string;
  code?: string;
  description: string;
  studentCount: number;
};

function readErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find((entry): entry is string => typeof entry === "string");
      return firstMessage || "수업 생성에 실패했습니다.";
    }
  }

  return "수업 생성에 실패했습니다.";
}

function mapCreatedClass(classroom: CreateClassResponseData): ClassCardItem {
  return {
    id: classroom.classId,
    href: `/class/${classroom.classId}`,
    name: classroom.name,
    code: classroom.classCode,
    description: classroom.description || "",
    studentCount: classroom.studentCount,
  };
}

const mockClassCards: ClassCardItem[] = teacherClassrooms.map((classroom) => ({
  id: classroom.id,
  href: `/class/${classroom.id}`,
  name: classroom.name,
  code: classroom.code,
  description: classroom.description,
  studentCount: classroom.studentCount,
}));

export default function TeacherClassesPage() {
  const [createdClasses, setCreatedClasses] = useState<ClassCardItem[]>([]);
  const createClassMutation = useCreateClassMutation();
  const classrooms = [...createdClasses, ...mockClassCards];

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title="만든 수업을 한눈에 보고 바로 관리할 수 있습니다"
        description="수업 코드, 학생 수, 모둠 수와 수업 설명을 빠르게 확인하고 필요한 수업으로 바로 이동해 보세요."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        actions={
          <CreateClassDialog
            pending={createClassMutation.isPending}
            onSubmit={async (payload) => {
              try {
                const response = await createClassMutation.mutateAsync({
                  name: payload.name,
                  description: payload.description || undefined,
                });

                setCreatedClasses((currentClasses) => [
                  mapCreatedClass(response.class),
                  ...currentClasses,
                ]);
                toast.success("수업이 생성되었습니다.");
              } catch (error) {
                toast.error(readErrorMessage(error));
                throw error;
              }
            }}
          />
        }
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-3 sm:p-5 lg:p-6">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {classrooms.map((classroom) => (
            <ClassCard
              key={classroom.id}
              href={classroom.href}
              name={classroom.name}
              code={classroom.code}
              description={classroom.description}
              footerLabel="학생 수"
              footerValue={`${classroom.studentCount}명`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
