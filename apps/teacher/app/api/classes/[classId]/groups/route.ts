import { withTeacherAuth } from "../../../../../lib/api/route";
import {
  getClassGroups,
  type ClassGroupsResponseData,
} from "../../../../../lib/classes/service";

type ClassGroupsRouteContext = {
  params: Promise<{
    classId: string;
  }>;
};

export async function GET(_request: Request, context: ClassGroupsRouteContext) {
  const { classId } = await context.params;

  if (!classId) {
    return Response.json({ message: "수업 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<ClassGroupsResponseData>(
    ({ accessToken }) => getClassGroups(accessToken, classId),
    {
      mapData: (data) => ({ groups: data }),
    },
  );
}
