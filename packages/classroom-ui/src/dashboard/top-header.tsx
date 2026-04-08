import { Grid2x2, Menu, Plus } from "lucide-react";

import type { UserRole } from "../lib/mock-data";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { BrandLogo } from "./brand-logo";

type TopHeaderProps = {
  role: UserRole;
  profileName: string;
};

export function TopHeader({ role, profileName }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/92 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-foreground hover:bg-secondary"
            aria-label="메뉴"
          >
            <Menu className="size-6" />
          </Button>

          <div className="flex items-center gap-4">
            <BrandLogo size="header" />
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              {role === "student" ? "수강생" : "교강사"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-foreground hover:bg-secondary"
            aria-label="추가"
          >
            <Plus className="size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-foreground hover:bg-secondary"
            aria-label="앱"
          >
            <Grid2x2 className="size-5" />
          </Button>
          <Avatar className="size-11 ring-2 ring-primary/10">
            <AvatarFallback className="bg-slate-900 text-white">
              {profileName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
