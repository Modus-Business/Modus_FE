"use client";

import type { ReactNode } from "react";

import { AppShell } from "@modus/classroom-ui";

import { useStudentMeQuery } from "../hooks/use-settings";

export function StudentAppShell({ children }: { children: ReactNode }) {
  const meQuery = useStudentMeQuery();
  const accountName = meQuery.data?.role === "student" ? meQuery.data.name : "";

  return (
    <AppShell role="student" accountName={accountName}>
      {children}
    </AppShell>
  );
}
