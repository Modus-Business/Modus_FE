import { Layers3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCard, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentHomePage() {
  return (
    <>
      <PageHeader
        title="참여 중인 수업과 오늘 할 일을 한 번에 확인해요"
        description="student 앱은 수업 참여, 모둠 화면, 과제 제출 흐름을 독립된 앱으로 구성합니다."
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
      />

      <section>
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers3 className="size-5 text-primary" />참여 중인 수업</CardTitle>
            <CardDescription>본인이 등록한 수업과 다음 세션, 모둠 배정 상태만 홈에서 바로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {studentClassrooms.map((classroom) => (
              <ClassCard
                key={classroom.id}
                href={`/class/${classroom.id}`}
                name={classroom.name}
                code={classroom.code}
                schedule={classroom.schedule}
                description={classroom.description}
                metaLabel="다음 수업"
                metaValue={classroom.nextSession}
                footerLabel={classroom.teamName ? "내 모둠" : "모둠 상태"}
                footerValue={classroom.teamName ?? "배정 전"}
              />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
