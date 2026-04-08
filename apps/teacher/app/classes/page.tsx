import { ClassCard, CreateClassDialog, PageHeader, teacherClassrooms, teacherProfile } from "@modus/classroom-ui";

export default function TeacherClassesPage() {
  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title="운영 중인 클래스 목록을 카드형으로 정리했습니다"
        description="코드, 인원 수, 모둠 수, 설명을 한 번에 노출해 교강사가 수업 상태를 빠르게 파악할 수 있게 구성합니다."
        profileName={teacherProfile.nickname}
        profileDescriptor={teacherProfile.descriptor}
        actions={<CreateClassDialog />}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-4 sm:p-5 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teacherClassrooms.map((classroom) => (
            <ClassCard
              key={classroom.id}
              href={`/class/${classroom.id}`}
              name={classroom.name}
              code={classroom.code}
              schedule={classroom.schedule}
              description={classroom.description}
              metaLabel="코호트"
              metaValue={classroom.cohort}
              footerLabel="학생 수"
              footerValue={`${classroom.studentCount}명`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
