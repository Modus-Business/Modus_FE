import { ClassCard, EmptyState, PageHeader, studentProfile } from "@modus/classroom-ui";

import { getStudentClassroomsForApp } from "../../lib/classes/lookup";

export default async function StudentClassesPage() {
  const classrooms = await getStudentClassroomsForApp();

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
        {classrooms.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {classrooms.map((classroom) => (
              <ClassCard
                key={classroom.id}
                href={`/class/${classroom.id}`}
                name={classroom.name}
                description={classroom.description}
                footerLabel={classroom.teamName ? "모둠" : "모둠 상태"}
                footerValue={classroom.teamName ?? "배정 전"}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="참여 중인 수업이 없습니다"
            description="상단의 수업 참여 버튼으로 수업 코드를 입력해 새 수업에 참여해 보세요."
          />
        )}
      </section>
    </div>
  );
}
