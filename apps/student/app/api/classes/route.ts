import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, ClassesApiError, fetchClasses } from "../../../lib/classes";

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
