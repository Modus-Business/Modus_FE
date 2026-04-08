import { ClassCard, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentClassesPage() {
  return (
    <>
      <PageHeader
        eyebrow="apps/student/classes"
        title="내가 참여한 클래스를 모아서 봅니다"
        description="데스크톱 기준으로 수업 카드 밀도를 높여, 클래스룸의 과목 목록처럼 탐색할 수 있게 구성했습니다."
        profileName={studentProfile.realName}
        profileDescriptor={studentProfile.descriptor}
      />
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {studentClassrooms.map((classroom) => (
          <ClassCard
            key={classroom.id}
            href={`/class/${classroom.id}`}
            name={classroom.name}
            code={classroom.code}
            schedule={classroom.schedule}
            description={classroom.description}
            metaLabel="트랙"
            metaValue={classroom.track}
            footerLabel={classroom.teamName ? "모둠" : "모둠 상태"}
            footerValue={classroom.teamName ?? "배정 전"}
          />
        ))}
      </section>
    </>
  );
}
