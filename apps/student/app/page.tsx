import { Layers3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, ClassCard, PageHeader, studentClassrooms, studentProfile } from "@modus/classroom-ui";

export default function StudentHomePage() {
  return (
    <div className="-mx-3 -my-3 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5">
      <PageHeader
        title="홈"
        description=""
        profileName={studentProfile.nickname}
        profileDescriptor={studentProfile.descriptor}
        showProfile={false}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />

      <section>
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 break-keep"><Layers3 className="size-5 text-primary" />참여 중인 수업</CardTitle>
            <CardDescription>본인이 등록한 수업과 다음 세션, 모둠 배정 상태만 홈에서 바로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="border-t border-border/70 bg-background/60 p-4 sm:p-5 lg:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {studentClassrooms.map((classroom) => (
                <ClassCard
                  key={classroom.id}
                  href={`/class/${classroom.id}`}
                  name={classroom.name}
                  schedule={classroom.schedule}
                  description={classroom.description}
                  metaLabel="다음 수업"
                  metaValue={classroom.nextSession}
                  footerLabel={classroom.teamName ? "내 모둠" : "모둠 상태"}
                  footerValue={classroom.teamName ?? "배정 전"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
