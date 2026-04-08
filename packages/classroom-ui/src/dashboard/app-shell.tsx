import type { ReactNode } from "react";

import { studentProfile, teacherProfile, type UserRole } from "../lib/mock-data";
import { SidebarNav } from "./sidebar-nav";
import { TopHeader } from "./top-header";

type AppShellProps = {
  role: UserRole;
  children: ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const profile = role === "student" ? studentProfile : teacherProfile;

  return (
    <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SidebarNav
        role={role}
        nickname={profile.nickname}
        descriptor={profile.descriptor}
        footerNote={profile.footerNote}
      />
      <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.12),_transparent_32%),linear-gradient(180deg,#f8faff_0%,#f4f7fb_100%)]">
        <TopHeader role={role} profileName={profile.realName} />
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex w-full min-w-0 flex-col gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
