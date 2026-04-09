import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "../../lib";
import { Avatar, AvatarFallback } from "../../ui";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  profileName: string;
  profileDescriptor: string;
  showProfile?: boolean;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  profileName,
  profileDescriptor,
  showProfile = true,
  actions,
  className,
}: PageHeaderProps) {
  const today = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(new Date());
  const compactDescriptor = profileDescriptor.split("·")[0]?.trim() ?? profileDescriptor;

  return (
    <header className={cn("border border-border/70 bg-white/90 px-4 py-4 shadow-none sm:px-5 sm:py-5 lg:px-6 lg:py-6", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              <CalendarDays className="size-4" />
              오늘: {today}
            </span>
            {eyebrow ? <span className="font-medium text-primary">{eyebrow}</span> : null}
          </div>
          <div className="min-w-0">
            <h2 className="break-keep text-xl font-semibold tracking-tight text-foreground sm:text-[1.75rem] lg:text-[2rem] lg:leading-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-3xl break-keep text-sm leading-6 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto lg:max-w-[42rem] lg:items-end">
          {actions ? (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start lg:justify-end [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
          {showProfile ? (
            <div className="flex w-full min-w-0 items-center gap-3 rounded-[24px] border border-primary/10 bg-[linear-gradient(180deg,rgba(248,250,255,0.96)_0%,rgba(242,246,255,0.96)_100%)] px-4 py-3 shadow-[0_10px_30px_rgba(91,132,255,0.08)] sm:w-auto sm:min-w-[220px]">
              <Avatar className="size-10 bg-secondary sm:size-11">
                <AvatarFallback
                  className="bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)] text-transparent"
                  aria-hidden="true"
                >
                  {profileName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm font-semibold text-foreground">{profileName}</p>
                <p className="truncate text-xs leading-5 text-muted-foreground">{compactDescriptor}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
