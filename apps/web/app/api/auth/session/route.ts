import { NextResponse } from "next/server";

import { getSessionFromCookies } from "../../../../lib/auth";

export async function GET() {
  return NextResponse.json(await getSessionFromCookies());
}
