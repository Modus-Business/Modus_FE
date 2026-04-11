import { NextResponse } from "next/server";

import { postToBackend } from "../../../../lib/auth";

type SignupResponseData = {
  userId: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  createdAt: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const result = await postToBackend<SignupResponseData>("/auth/signup", body);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({
    signedUp: true,
    email: result.data.email,
  });
}
