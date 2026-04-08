"use client";

import { useState } from "react";
import { ChevronDown, Hash, Users } from "lucide-react";

import type { MemberProfile } from "@modus/classroom-ui";
import { Avatar, AvatarFallback, Card, CardContent, CardHeader, CardTitle, cn } from "@modus/classroom-ui";

type GroupMembersCardProps = {
  members: MemberProfile[];
  code: string;
  className?: string;
};

const memberAvatarStyles = [
  "bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#effbf6_0%,#d8f5e8_58%,#bfe9d8_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#fff4ee_0%,#ffe2d2_58%,#ffd0bb_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#f5f1ff_0%,#e4dbff_58%,#d3c7ff_100%)]",
];

export function GroupMembersCard({ members, code, className }: GroupMembersCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              {members.length}
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
          {members.map((member, index) => (
            <div key={member.id} className="border-t border-border/70 bg-background/70 p-4 first:border-t-0">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 ring-2 ring-white/80">
                  <AvatarFallback
                    className={memberAvatarStyles[index % memberAvatarStyles.length]}
                    aria-hidden="true"
                  />
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">{member.nickname}</p>
                </div>
              </div>
            </div>
          ))}
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
