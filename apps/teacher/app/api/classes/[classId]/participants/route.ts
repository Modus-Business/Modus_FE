import { withTeacherAuth } from "../../../../../lib/api/route";
import {
  getClassParticipants,
  type ClassParticipantsResponseData,
} from "../../../../../lib/classes/service";

type ClassParticipantsRouteContext = {
  params: Promise<{
    classId: string;
  }>;
};

export async function GET(_request: Request, context: ClassParticipantsRouteContext) {
  const { classId } = await context.params;

  if (!classId) {
    return Response.json({ message: "수업 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<ClassParticipantsResponseData>(
    ({ accessToken }) => getClassParticipants(accessToken, classId),
    {
      mapData: (data) => ({ participants: data }),
    },
  );
}
