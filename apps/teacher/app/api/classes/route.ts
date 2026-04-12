import { withTeacherAuth, withTeacherAuthJson } from "../../../lib/api/route";
import {
  createClass,
  getClasses,
  type ClassesResponseData,
  type CreateClassRequest,
  type CreateClassResponseData,
} from "../../../lib/classes/service";

export function GET() {
  return withTeacherAuth<ClassesResponseData>(
    ({ accessToken }) => getClasses(accessToken),
  );
}

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
