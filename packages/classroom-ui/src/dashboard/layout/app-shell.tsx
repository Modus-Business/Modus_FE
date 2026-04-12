"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import { getTeacherClassroom, studentProfile, teacherProfile, type StudentClassroom, type UserRole } from "../../lib/mock-data";
import { NoticesDialog, SubmitAssignmentDialog } from "../dialogs/dialog-triggers";
import { SidebarNav } from "./sidebar-nav";
import { TopHeader } from "./top-header";

type AppShellProps = {
  role: UserRole;
  accountName?: string;
  studentJoinAction?: ReactNode;
  studentClassroomsOverride?: StudentClassroom[];
  children: ReactNode;
};

export function AppShell({ role, accountName, studentJoinAction, studentClassroomsOverride, children }: AppShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const profile = role === "student" ? studentProfile : teacherProfile;
  const headerDisplayName = accountName || "";
  const studentClassroomMatch = role === "student" ? pathname.match(/^\/class\/([^/]+)$/) : null;
  const teacherClassroomMatch = role === "teacher" ? pathname.match(/^\/class\/([^/]+)(?:\/.*)?$/) : null;
  const studentClassroom = studentClassroomMatch
    ? (studentClassroomsOverride || []).find((classroom) => classroom.id === decodeURIComponent(studentClassroomMatch[1]))
    : undefined;
  const teacherClassroom = teacherClassroomMatch ? getTeacherClassroom(decodeURIComponent(teacherClassroomMatch[1])) : undefined;
  const studentGroupLabel = studentClassroom?.group?.name.split("·")[0]?.trim();
  const studentGroupNickname = studentClassroom?.group
    ? studentClassroom.group.members.find((member) => member.realName === studentProfile.realName)?.nickname ?? studentProfile.nickname
    : undefined;
  const classroomHeaderActions = studentClassroom ? (
    <>
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
          "fixed inset-y-0 left-0 z-50 w-[min(84vw,320px)] max-w-[20rem] -translate-x-full border-r border-border/70 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-in-out lg:hidden",
          mobileNavOpen && "translate-x-0",
        )}
      >
        <SidebarNav
          role={role}
          onToggle={() => setMobileNavOpen(false)}
          onNavigate={() => setMobileNavOpen(false)}
          className="bg-white/95"
        />
      </div>

      <main className="flex min-h-svh min-w-0 flex-col bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.12),_transparent_32%),linear-gradient(180deg,#f8faff_0%,#f4f7fb_100%)]">
        <TopHeader
          role={role}
          profileName={headerDisplayName}
          profileDescriptor={profile.descriptor}
          studentJoinAction={studentJoinAction}
          hideProfileDescriptor={role === "teacher"}
          showRoleAction={!(role === "teacher" && pathname === "/classes")}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          showBrandLogo={studentClassroom || teacherClassroom ? true : showHeaderBrandLogo}
          classroomContext={
            studentClassroom
              ? {
                  title: studentClassroom.name,
                  subtitle: studentGroupLabel,
                  actions: classroomHeaderActions,
                  profileName: studentGroupNickname,
                  hideProfileDescriptor: true,
                }
              : teacherClassroom
                ? {
                    title: teacherClassroom.name,
                    hideProfileDescriptor: true,
                  }
              : undefined
          }
        />
        <div className="flex min-h-0 flex-1 px-2.5 py-2.5 sm:px-4 sm:py-4 lg:px-5 lg:py-5 xl:px-6">
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2.5 sm:gap-3 lg:gap-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
