import { notFound } from "next/navigation";

import { ClassCodeDialog, NewNoticeDialog, NoticesDialog, PageHeader, teacherProfile } from "@modus/classroom-ui";
import { getTeacherClassroomForRoute } from "../../../lib/classes/lookup";
import { GroupStatusSection } from "./group-status-section";

type TeacherClassPageProps = {
  params: Promise<{ classId: string }>;
};

export default async function TeacherClassPage({ params }: TeacherClassPageProps) {
  const { classId } = await params;
  const classroom = await getTeacherClassroomForRoute(classId);
  if (!classroom) notFound();

  return (
    <div className="-mx-2.5 -my-2.5 flex flex-col gap-0 sm:-mx-4 sm:-my-4 lg:-mx-5 lg:-my-5 xl:-mx-6 xl:-my-6">
      <PageHeader
        title={classroom.name}
        description={classroom.description}
        profileName={teacherProfile.realName}
        profileDescriptor={teacherProfile.descriptor}
        showProfile={false}
        actions={<><ClassCodeDialog classCode={classroom.code} /><NoticesDialog notices={classroom.notices} detailTitlePrefix="공지" allowManage /><NewNoticeDialog /></>}
        className="border-b-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      />

      <section className="bg-background/60 p-3 sm:p-5 lg:p-6">
        <GroupStatusSection classId={classId} teams={classroom.teams} />
        </section>
    </div>
  );
}
