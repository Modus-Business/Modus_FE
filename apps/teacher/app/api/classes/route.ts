import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiClientError, createBackendServerClient } from "@modus/api-client";

import { ACCESS_TOKEN_COOKIE, ClassesApiError, fetchClasses } from "../../../lib/classes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  try {
    const classes = await fetchClasses(accessToken);
    return NextResponse.json({ classes });
  } catch (error) {
    if (error instanceof ClassesApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "수업 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

type CreateClassRequestDto = {
  name: string;
  description?: string;
};

type CreateClassResponseDto = {
  classId: string;
  name: string;
  description: string | null;
  classCode: string;
  studentCount: number;
  createdAt: string;
};

type CreateClassEnvelope = {
  success: boolean;
  statusCode: number;
  data: CreateClassResponseDto;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = (await request.json().catch(() => null)) as CreateClassRequestDto | null;

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!API_BASE_URL) {
    return NextResponse.json({ message: "API 주소가 설정되지 않았습니다." }, { status: 500 });
  }

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  try {
    const client = createBackendServerClient({
      baseURL: API_BASE_URL,
      getAccessToken: () => accessToken,
    });

    const response = await client.post<CreateClassEnvelope>("/classes", body);
    return NextResponse.json({ class: response.data.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiClientError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "수업 생성에 실패했습니다." }, { status: 500 });
  }
}
