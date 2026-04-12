import { withTeacherAuthJson } from "../../../lib/api/route";
import {
  createGroup,
  type CreateGroupRequest,
  type CreateGroupResponseData,
} from "../../../lib/groups/service";

export function POST(request: Request) {
  return withTeacherAuthJson<CreateGroupRequest, CreateGroupResponseData>(
    request,
    ({ accessToken, body }) => createGroup(accessToken, body),
    {
      successStatus: 201,
      mapData: (data) => ({ group: data }),
    },
  );
}
