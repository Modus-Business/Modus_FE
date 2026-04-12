import { withTeacherAuth } from "../../../../../../lib/api/route";
import {
  getClassSubmissionStatuses,
  type AssignmentSubmissionStatusListResponseData,
} from "../../../../../../lib/assignments/service";

type ClassSubmissionStatusesRouteContext = {
  params: Promise<{
    classId: string;
  }>;
};

export async function GET(_request: Request, context: ClassSubmissionStatusesRouteContext) {
  const { classId } = await context.params;

  if (!classId) {
    return Response.json({ message: "수업 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<AssignmentSubmissionStatusListResponseData>(
    ({ accessToken }) => getClassSubmissionStatuses(accessToken, classId),
    {
      mapData: (data) => ({ submissions: data }),
    },
  );
}
