import { withTeacherAuthJson } from "../../../lib/api/route";
import {
  createNotice,
  type CreateNoticeRequest,
  type NoticeItemResponseData,
} from "../../../lib/notices/service";

export function POST(request: Request) {
  return withTeacherAuthJson<CreateNoticeRequest, NoticeItemResponseData>(
    request,
    ({ accessToken, body }) => createNotice(accessToken, body),
    {
      successStatus: 201,
      mapData: (data) => ({ notice: data }),
    },
  );
}
