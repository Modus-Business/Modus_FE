import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "../lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  profileName: string;
  profileDescriptor: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, eyebrow, profileName, profileDescriptor, actions, className }: PageHeaderProps) {
  const today = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).format(new Date());
  const compactDescriptor = profileDescriptor.split("·")[0]?.trim() ?? profileDescriptor;

  return (
    <header className={cn("border border-border/70 bg-white/90 px-5 py-4 shadow-none", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              <CalendarDays className="size-4" />
              {today}
            </span>
          </div>
          <div>
            <h2 className="text-[2rem] font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          <div className="flex min-w-[220px] items-center gap-3 border border-border/70 bg-background/70 px-4 py-3">
            <Avatar className="size-11 ring-4 ring-primary/10">
              <AvatarFallback className="bg-[radial-gradient(circle_at_30%_30%,#f1f5ff_0%,#dfe8ff_55%,#cfdcff_100%)] text-transparent" aria-hidden="true" />
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{profileName}</p>
              <p className="text-xs leading-5 text-muted-foreground">{compactDescriptor}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
