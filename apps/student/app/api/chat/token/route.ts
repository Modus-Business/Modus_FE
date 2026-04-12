import { withStudentAuth } from "../../../../lib/api/route";
import type { ChatTokenResponse } from "../../../../lib/chat/types";

export async function GET() {
  return withStudentAuth<ChatTokenResponse>(async ({ accessToken }) => ({
    ok: true,
    status: 200,
    data: {
      token: accessToken,
    },
  }));
}
