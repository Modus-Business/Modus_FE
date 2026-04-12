import { withStudentAuth } from "../../../../../../lib/api/route";
import {
  getMySubmission,
  type AssignmentSubmissionItemData,
} from "../../../../../../lib/assignments/service";

type MySubmissionRouteContext = {
  params: Promise<{
    groupId: string;
  }>;
};

export async function GET(_request: Request, context: MySubmissionRouteContext) {
  const { groupId } = await context.params;

  if (!groupId) {
    return Response.json({ message: "모둠 ID가 필요합니다." }, { status: 400 });
  }

  return withStudentAuth<AssignmentSubmissionItemData | null>(
    ({ accessToken }) => getMySubmission(accessToken, groupId),
    {
      mapData: (data) => ({ submission: data }),
    },
  );
}
