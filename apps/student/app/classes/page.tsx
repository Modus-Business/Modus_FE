import { ClassCard, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentClassesPage() {
  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title="내가 참여한 클래스를 모아서 봅니다"
        description="참여 중인 수업을 한눈에 훑고, 필요한 클래스 상세 화면으로 바로 이동할 수 있게 정리했습니다."
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        className="border-b-0 px-6 py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-4 sm:p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {studentClassrooms.map((classroom) => (
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
      </section>
    </div>
  );
}
