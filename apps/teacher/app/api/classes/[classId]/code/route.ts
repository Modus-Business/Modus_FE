import { withTeacherAuth } from "../../../../../lib/api/route";
import {
  regenerateClassCode,
  type RegenerateClassCodeResponseData,
} from "../../../../../lib/classes/service";

type RegenerateClassCodeRouteContext = {
  params: Promise<{
    classId: string;
  }>;
};

export async function PATCH(_request: Request, context: RegenerateClassCodeRouteContext) {
  const { classId } = await context.params;

  if (!classId) {
    return Response.json({ message: "수업 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<RegenerateClassCodeResponseData>(
    ({ accessToken }) => regenerateClassCode(accessToken, classId),
    {
      mapData: (data) => ({ classCode: data }),
    },
  );
}
