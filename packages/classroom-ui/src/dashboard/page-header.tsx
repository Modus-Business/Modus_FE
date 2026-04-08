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

  return (
    <header className={cn("rounded-[30px] border border-border/70 bg-white/90 px-6 py-5 shadow-[0_20px_60px_rgba(106,130,188,0.08)] backdrop-blur", className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              <CalendarDays className="size-4" />
              {today}
            </span>
            {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          <div className="flex min-w-[220px] items-center gap-3 rounded-3xl border border-border/70 bg-background/70 px-4 py-3">
            <Avatar className="size-11 ring-4 ring-primary/10">
              <AvatarFallback>{profileName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{profileName}</p>
              <p className="text-xs leading-5 text-muted-foreground">{profileDescriptor}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
