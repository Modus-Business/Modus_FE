import { ClassCard, CreateClassDialog, PageHeader, teacherClassrooms, teacherProfile } from "@modus/classroom-ui";

export default function TeacherClassesPage() {
  return (
    <>
      <PageHeader
        eyebrow="apps/teacher/classes"
        title="운영 중인 클래스 목록을 카드형으로 정리했습니다"
        description="코드, 인원 수, 모둠 수, 설명을 한 번에 노출해 교강사가 수업 상태를 빠르게 파악할 수 있게 구성합니다."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        actions={<CreateClassDialog />}
      />
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </>
  );
}
