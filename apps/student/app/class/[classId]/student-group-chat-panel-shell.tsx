"use client";

import dynamic from "next/dynamic";

import type { GroupSummary } from "@modus/classroom-ui";

const StudentGroupChatPanel = dynamic(
  () => import("./student-group-chat-panel").then((module) => module.StudentGroupChatPanel),
  {
    ssr: false,
  },
);

export function StudentGroupChatPanelShell({
  group,
  className,
}: {
  group: GroupSummary;
  className?: string;
}) {
  return <StudentGroupChatPanel group={group} className={className} />;
}
