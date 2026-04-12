import { getTeacherRefreshToken, teacherLoggedOutResponse } from "../../../../lib/api/route";
import { clearAuthCookies, logoutFromBackend } from "../../../../lib/auth/logout";

export async function POST() {
  const refreshToken = await getTeacherRefreshToken();

  if (refreshToken) {
    await logoutFromBackend(refreshToken);
  }

  return teacherLoggedOutResponse(clearAuthCookies);
}
