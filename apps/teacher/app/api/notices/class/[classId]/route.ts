import { withTeacherAuth } from "../../../../../lib/api/route";
import {
  getNoticesByClass,
  type NoticeListResponseData,
} from "../../../../../lib/notices/service";

type ClassNoticesRouteContext = {
  params: Promise<{
    classId: string;
  }>;
};

export async function GET(_request: Request, context: ClassNoticesRouteContext) {
  const { classId } = await context.params;

  if (!classId) {
    return Response.json({ message: "수업 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<NoticeListResponseData>(
    ({ accessToken }) => getNoticesByClass(accessToken, classId),
  );
}
