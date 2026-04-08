import { Grid2x2, Plus } from "lucide-react";

import type { UserRole } from "../lib/mock-data";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { CreateClassDialog, JoinClassDialog } from "./dialog-triggers";

type TopHeaderProps = {
  role: UserRole;
  profileName: string;
};

export function TopHeader({ role, profileName }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/92 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5 sm:px-6 lg:px-8">
        <div />

        <div className="flex items-center gap-1 sm:gap-2">
          {role === "student" ? (
            <JoinClassDialog iconOnly />
          ) : (
            <CreateClassDialog iconOnly />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-foreground hover:bg-secondary"
            aria-label="앱"
          >
            <Grid2x2 className="size-5" />
          </Button>
          <Avatar className="size-11 ring-2 ring-primary/10">
            <AvatarFallback
              className="bg-[linear-gradient(135deg,#6f8dff_0%,#4068f2_100%)] text-transparent"
              aria-label={profileName}
            />
          </Avatar>
        </div>
      </div>
    </header>
  );
}
