import { ClassCard, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentClassesPage() {
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
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
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
