"use client";

import type { ReactNode } from "react";

import { AppShell } from "@modus/classroom-ui";

import { useTeacherMeQuery } from "../hooks/use-settings";

export function TeacherAppShell({ children }: { children: ReactNode }) {
  const meQuery = useTeacherMeQuery();
  const accountName = meQuery.data?.role === "teacher" ? meQuery.data.name : "";

  return (
    <AppShell role="teacher" accountName={accountName}>
      {children}
    </AppShell>
  );
}
