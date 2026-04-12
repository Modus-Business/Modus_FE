import { withStudentAuthJson } from "../../../../lib/api/route";
import {
  joinClass,
  type JoinClassRequest,
  type JoinClassResponseData,
} from "../../../../lib/classes/service";

export function POST(request: Request) {
  return withStudentAuthJson<JoinClassRequest, JoinClassResponseData>(
    request,
    ({ accessToken, body }) => joinClass(accessToken, body),
    {
      successStatus: 201,
      mapData: (data) => ({ class: data }),
    },
  );
}
