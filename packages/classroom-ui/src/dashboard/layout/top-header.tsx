import Link from "next/link";
import { Menu } from "lucide-react";

import type { UserRole } from "../../lib/mock-data";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { BrandLogo } from "../brand/brand-logo";
import { CreateClassDialog, JoinClassDialog } from "../dialogs/dialog-triggers";

type TopHeaderProps = {
  role: UserRole;
  profileName: string;
  profileDescriptor: string;
  onOpenMobileNav?: () => void;
  showBrandLogo?: boolean;
};

export function TopHeader({ role, profileName, profileDescriptor, onOpenMobileNav, showBrandLogo = true }: TopHeaderProps) {
  const compactDescriptor = profileDescriptor.split("·")[0]?.trim() ?? profileDescriptor;

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/92 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full text-foreground hover:bg-secondary lg:hidden"
            aria-label="메뉴 열기"
            onClick={onOpenMobileNav}
          >
            <Menu className="size-5" />
          </Button>
          {showBrandLogo ? <BrandLogo size="header" /> : null}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {role === "student" ? <JoinClassDialog iconOnly /> : <CreateClassDialog iconOnly />}
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-2xl px-1 py-1 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="설정으로 이동"
          >
            <Avatar className="size-10 ring-2 ring-primary/10 transition-all duration-150 group-hover:ring-primary/20 group-hover:shadow-[0_8px_20px_rgba(91,132,255,0.12)] sm:size-11">
              <AvatarFallback
                className="bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)] text-transparent"
                aria-hidden="true"
              >
                {profileName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-base font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">{profileName}</p>
              <p className="truncate text-sm text-muted-foreground transition-colors duration-150 group-hover:text-foreground/70">{compactDescriptor}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
