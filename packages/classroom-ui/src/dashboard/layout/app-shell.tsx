"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import { getStudentClassroom, studentProfile, teacherProfile, type UserRole } from "../../lib/mock-data";
import { AssignmentSummaryDialog, NoticesDialog, SubmitAssignmentDialog } from "../dialogs/dialog-triggers";
import { SidebarNav } from "./sidebar-nav";
import { TopHeader } from "./top-header";

type AppShellProps = {
  role: UserRole;
  children: ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const profile = role === "student" ? studentProfile : teacherProfile;
  const displayName = role === "student" ? profile.nickname : profile.realName;
  const studentClassroomMatch = role === "student" ? pathname.match(/^\/class\/([^/]+)$/) : null;
  const studentClassroom = studentClassroomMatch ? getStudentClassroom(decodeURIComponent(studentClassroomMatch[1])) : undefined;
  const studentGroupLabel = studentClassroom?.group?.name.split("·")[0]?.trim();
  const classroomHeaderActions = studentClassroom ? (
    <>
      <AssignmentSummaryDialog
        assignments={studentClassroom.assignments}
        triggerProps={{
          size: "lg",
          className:
            "h-11 rounded-full border-primary/20 bg-white px-5 text-sm font-semibold text-foreground shadow-none hover:border-primary/35 hover:bg-primary/5",
        }}
      />
      <NoticesDialog
        notices={studentClassroom.notices}
        triggerProps={{
          size: "lg",
          className:
            "h-11 rounded-full border-primary/20 bg-white px-5 text-sm font-semibold text-foreground shadow-none hover:border-primary/35 hover:bg-primary/5",
        }}
      />
      <SubmitAssignmentDialog
        className={studentClassroom.name}
        triggerProps={{ size: "lg", className: "h-11 rounded-full px-5 text-sm font-semibold shadow-[0_8px_20px_rgba(91,132,255,0.18)]" }}
      />
    </>
  ) : null;

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 1279px)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const syncLayoutState = () => {
      setSidebarExpanded(!compactQuery.matches);
      if (desktopQuery.matches) {
        setMobileNavOpen(false);
      }
    };

    syncLayoutState();
    compactQuery.addEventListener("change", syncLayoutState);
    desktopQuery.addEventListener("change", syncLayoutState);

    return () => {
      compactQuery.removeEventListener("change", syncLayoutState);
      desktopQuery.removeEventListener("change", syncLayoutState);
    };
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const showHeaderBrandLogo = !mobileNavOpen;

  return (
    <div
      className="min-h-svh bg-background text-foreground transition-[grid-template-columns] duration-300 ease-in-out lg:grid"
      style={
        {
          gridTemplateColumns: `${sidebarExpanded ? "280px" : "88px"} minmax(0, 1fr)`,
        } as CSSProperties
      }
    >
      <div className="hidden border-r border-border/70 bg-white/90 transition-[width] duration-300 ease-in-out lg:block">
        <SidebarNav
          role={role}
          nickname={displayName}
          descriptor={profile.descriptor}
          collapsed={!sidebarExpanded}
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/36 backdrop-blur-sm transition-opacity lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] -translate-x-full border-r border-border/70 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-in-out lg:hidden",
          mobileNavOpen && "translate-x-0",
        )}
      >
        <SidebarNav
          role={role}
          nickname={displayName}
          descriptor={profile.descriptor}
          onToggle={() => setMobileNavOpen(false)}
          onNavigate={() => setMobileNavOpen(false)}
          className="bg-white/95"
        />
      </div>

      <main className="flex min-h-svh min-w-0 flex-col bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.12),_transparent_32%),linear-gradient(180deg,#f8faff_0%,#f4f7fb_100%)]">
        <TopHeader
          role={role}
          profileName={displayName}
          profileDescriptor={profile.descriptor}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          showBrandLogo={studentClassroom ? true : showHeaderBrandLogo}
          classroomContext={
            studentClassroom
              ? {
                  title: studentClassroom.name,
                  subtitle: studentGroupLabel,
                  actions: classroomHeaderActions,
                  profileName: studentProfile.nickname,
                  hideProfileDescriptor: true,
                }
              : undefined
          }
        />
        <div className="flex min-h-0 flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3">{children}</div>
        </div>
      </main>
    </div>
  );
}
