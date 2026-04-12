import Link from "next/link";
import { notFound } from "next/navigation";

import { Button, PageHeader, TeamArrangementBoard, teacherProfile } from "@modus/classroom-ui";
import { getTeacherClassroomForRoute } from "../../../../lib/classes/lookup";

type TeacherGroupArrangementPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function TeacherGroupArrangementPage({ params }: TeacherGroupArrangementPageProps) {
  const { classId } = await params;
  const classroom = await getTeacherClassroomForRoute(classId);
  if (!classroom) notFound();

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title="모둠 배치"
        description="학생을 모둠으로 배치하고 새 모둠을 추가해 수업 운영 구조를 빠르게 정리해 보세요."
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        actions={
          <Button asChild variant="outline">
            <Link href={`/class/${classId}`}>수업 상세로 돌아가기</Link>
          </Button>
        }
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />
      <section className="bg-background/60 p-3 sm:p-5 lg:p-6">
        <TeamArrangementBoard classroom={classroom} />
      </section>
    </div>
  );
}
