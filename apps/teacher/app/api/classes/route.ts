import { withTeacherAuthJson } from "../../../lib/api/route";
import { createClass, type CreateClassRequest, type CreateClassResponseData } from "../../../lib/classes/service";

export function POST(request: Request) {
  return withTeacherAuthJson<CreateClassRequest, CreateClassResponseData>(
    request,
    ({ accessToken, body }) => createClass(accessToken, body),
    {
      successStatus: 201,
      mapData: (data) => ({ class: data }),
    },
  );
}
