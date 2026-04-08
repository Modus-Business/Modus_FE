"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");

    const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

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
          nickname={profile.realName}
          descriptor={profile.descriptor}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      </div>
      <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.12),_transparent_32%),linear-gradient(180deg,#f8faff_0%,#f4f7fb_100%)]">
        <TopHeader role={role} profileName={profile.realName} />
        <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <div className="flex w-full min-w-0 flex-col gap-3">{children}</div>
        </div>
      </main>
    </div>
  );
}
