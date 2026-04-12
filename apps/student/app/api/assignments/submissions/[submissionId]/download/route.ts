import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "../../../../../../lib/api/route";
import { fetchSubmissionFile } from "../../../../../../lib/assignments/service";

type SubmissionDownloadRouteContext = {
  params: Promise<{
    submissionId: string;
  }>;
};

export async function GET(_request: Request, context: SubmissionDownloadRouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const { submissionId } = await context.params;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!submissionId) {
    return NextResponse.json({ message: "제출 ID가 필요합니다." }, { status: 400 });
  }

  const result = await fetchSubmissionFile(accessToken, submissionId);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const headers = new Headers();

  if (result.data.contentType) {
    headers.set("Content-Type", result.data.contentType);
  }

  if (result.data.contentDisposition) {
    headers.set("Content-Disposition", result.data.contentDisposition);
  }

  if (result.data.contentLength) {
    headers.set("Content-Length", result.data.contentLength);
  }

  return new Response(result.data.body, {
    status: result.status,
    headers,
  });
}
