import { getStudentRefreshToken, studentLoggedOutResponse } from "../../../../lib/api/route";
import { clearAuthCookies, logoutFromBackend } from "../../../../lib/auth/logout";

export async function POST() {
  const refreshToken = await getStudentRefreshToken();

  if (refreshToken) {
    await logoutFromBackend(refreshToken);
  }

  return studentLoggedOutResponse(clearAuthCookies);
}
