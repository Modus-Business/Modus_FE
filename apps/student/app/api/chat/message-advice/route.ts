import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "../../../../lib/api/route";
import { normalizeMessageAdvicePayload } from "../../../../lib/chat/normalize";
import { submitMessageAdvice, type ChatMessageAdviceRequest } from "../../../../lib/chat/service";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = (await request.json().catch(() => null)) as ChatMessageAdviceRequest | null;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!body?.groupId || !body?.content.trim()) {
    return NextResponse.json({ message: "모둠 ID와 메시지 내용이 필요합니다." }, { status: 400 });
  }

  const result = await submitMessageAdvice(accessToken, body);

  if (!result.ok) {
    if (result.status === 400 || result.status === 403) {
      return NextResponse.json(normalizeMessageAdvicePayload(result.raw, result.status));
    }

    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json(normalizeMessageAdvicePayload(result.data, result.status));
}
