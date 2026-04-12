import { withTeacherAuth, withTeacherAuthJson } from "../../../../lib/api/route";
import {
  deleteNotice,
  type DeleteNoticeResponseData,
  type NoticeItemResponseData,
  updateNotice,
  type UpdateNoticeRequest,
} from "../../../../lib/notices/service";

type NoticeRouteContext = {
  params: Promise<{
    noticeId: string;
  }>;
};

export async function PATCH(request: Request, context: NoticeRouteContext) {
  const { noticeId } = await context.params;

  if (!noticeId) {
    return Response.json({ message: "공지 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuthJson<UpdateNoticeRequest, NoticeItemResponseData>(
    request,
    ({ accessToken, body }) => updateNotice(accessToken, noticeId, body),
    {
      mapData: (data) => ({ notice: data }),
    },
  );
}

export async function DELETE(_request: Request, context: NoticeRouteContext) {
  const { noticeId } = await context.params;

  if (!noticeId) {
    return Response.json({ message: "공지 ID가 필요합니다." }, { status: 400 });
  }

  return withTeacherAuth<DeleteNoticeResponseData>(
    ({ accessToken }) => deleteNotice(accessToken, noticeId),
    {
      mapData: (data) => ({ result: data }),
    },
  );
}
