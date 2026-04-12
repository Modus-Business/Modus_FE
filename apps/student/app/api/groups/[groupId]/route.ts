import { withStudentAuth } from "../../../../lib/api/route";
import {
  getGroupDetail,
  type GroupDetailResponseData,
} from "../../../../lib/groups/service";

type GroupRouteContext = {
  params: Promise<{
    groupId: string;
  }>;
};

export async function GET(_request: Request, context: GroupRouteContext) {
  const { groupId } = await context.params;

  if (!groupId) {
    return Response.json({ message: "모둠 ID가 필요합니다." }, { status: 400 });
  }

  return withStudentAuth<GroupDetailResponseData>(
    ({ accessToken }) => getGroupDetail(accessToken, groupId),
    {
      mapData: (data) => ({ group: data }),
    },
  );
}
