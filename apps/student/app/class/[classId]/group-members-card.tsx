"use client";

import { useState } from "react";
import { ChevronDown, Hash, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, cn } from "@modus/classroom-ui";

type GroupMembersCardProps = {
  members?: Array<{
    id: string;
    nickname: string;
    isMe?: boolean;
  }>;
  memberCount?: number;
  code: string;
  className?: string;
};

export function GroupMembersCard({ members = [], memberCount, code, className }: GroupMembersCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const normalizedMembers = Array.isArray(members) ? members : [];
  const resolvedMemberCount = typeof memberCount === "number" ? memberCount : normalizedMembers.length;
  const showEmptyState = normalizedMembers.length === 0 && resolvedMemberCount === 0;

  return (
    <Card className={cn("h-fit bg-white/95", className)}>
      <CardHeader className="border-b border-border/70 p-0">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-secondary/30"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Users className="size-5 shrink-0 text-primary" />
            <CardTitle>모둠원</CardTitle>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {resolvedMemberCount}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen ? "rotate-180" : "",
            )}
          />
        </button>
      </CardHeader>

      {isOpen ? (
        <CardContent className="p-0">
          {normalizedMembers.map((member) => (
            <div key={member.id} className="border-t border-border/70 bg-background/70 p-4 first:border-t-0">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">{member.nickname}</p>
                {member.isMe ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    나
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          {showEmptyState ? (
            <div className="border-t border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
              아직 조회된 모둠원이 없습니다.
            </div>
          ) : null}
          <div className="border-t border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center gap-2 font-medium text-foreground">
              <Hash className="size-4 text-primary" />
              수업 코드 {code}
            </p>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
