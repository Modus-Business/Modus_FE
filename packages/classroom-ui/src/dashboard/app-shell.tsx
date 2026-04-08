"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { studentProfile, teacherProfile, type UserRole } from "../lib/mock-data";
import { SidebarNav } from "./sidebar-nav";
import { TopHeader } from "./top-header";

type AppShellProps = {
  role: UserRole;
  children: ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const profile = role === "student" ? studentProfile : teacherProfile;

  return (
    <div
      className="min-h-svh bg-background text-foreground transition-[grid-template-columns] duration-300 ease-in-out lg:grid"
      style={
        {
          gridTemplateColumns: `${sidebarOpen ? "280px" : "88px"} minmax(0, 1fr)`,
        } as CSSProperties
      }
    >
      <div className="hidden border-r border-border/70 bg-white/90 transition-[width] duration-300 ease-in-out lg:block">
        <SidebarNav
          role={role}
          nickname={profile.nickname}
          descriptor={profile.descriptor}
          footerNote={profile.footerNote}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      </div>
      <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.12),_transparent_32%),linear-gradient(180deg,#f8faff_0%,#f4f7fb_100%)]">
        <TopHeader role={role} profileName={profile.realName} />
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex w-full min-w-0 flex-col gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
