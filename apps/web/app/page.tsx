import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN_COOKIE, getSessionFromAccessToken } from "../lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const session = getSessionFromAccessToken(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value);

  if (!session.authenticated) {
    redirect("/auth");
  }

  const destination =
    session.user.role === "student" ? process.env.NEXT_PUBLIC_STUDENT : process.env.NEXT_PUBLIC_TEACHER;

  redirect(destination || "/auth");
}
