import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "../../../../lib/api/route";
import { normalizeInterventionAdvicePayload } from "../../../../lib/chat/normalize";
import { submitInterventionAdvice, type ChatInterventionAdviceRequest } from "../../../../lib/chat/service";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = (await request.json().catch(() => null)) as ChatInterventionAdviceRequest | null;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!body?.groupId) {
    return NextResponse.json({ message: "모둠 ID가 필요합니다." }, { status: 400 });
  }

  const result = await submitInterventionAdvice(accessToken, { groupId: body.groupId });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json(normalizeInterventionAdvicePayload(result.data));
}
