import { withTeacherAuth, withTeacherAuthJson } from "../../../../lib/api/route";
import {
  deleteGroup,
  getGroupDetail,
  updateGroup,
  type CreateGroupResponseData,
  type DeleteGroupResponseData,
  type GroupDetailResponseData,
  type UpdateGroupRequest,
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

  return withTeacherAuth<GroupDetailResponseData>(
    ({ accessToken }) => getGroupDetail(accessToken, groupId),
    {
      mapData: (data) => ({ group: data }),
    },
  );
}

export async function DELETE(_request: Request, context: GroupRouteContext) {
  const { groupId } = await context.params;

  if (!groupId) {
    return Response.json({ message: "모둠 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<DeleteGroupResponseData>(
    ({ accessToken }) => deleteGroup(accessToken, groupId),
    {
      mapData: (data) => ({ result: data }),
    },
  );
}

export async function PATCH(request: Request, context: GroupRouteContext) {
  const { groupId } = await context.params;

  if (!groupId) {
    return Response.json({ message: "모둠 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuthJson<UpdateGroupRequest, CreateGroupResponseData>(
    request,
    ({ accessToken, body }) => updateGroup(accessToken, groupId, body),
    {
      mapData: (data) => ({ group: data }),
    },
  );
}
