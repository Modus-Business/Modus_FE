import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Menu } from "lucide-react";

import type { UserRole } from "../../lib/mock-data";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { BrandLogo } from "../brand/brand-logo";
import { CreateClassDialog, JoinClassDialog } from "../dialogs/dialog-triggers";

type TopHeaderProps = {
  role: UserRole;
  profileName: string;
  profileDescriptor: string;
  hideProfileDescriptor?: boolean;
  onOpenMobileNav?: () => void;
  showBrandLogo?: boolean;
  classroomContext?: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    profileName?: string;
    profileDescriptor?: string;
    hideProfileDescriptor?: boolean;
  };
};

export function TopHeader({
  role,
  profileName,
  profileDescriptor,
  hideProfileDescriptor = false,
  onOpenMobileNav,
  showBrandLogo = true,
  classroomContext,
}: TopHeaderProps) {
  const effectiveProfileName = classroomContext?.profileName ?? profileName;
  const effectiveProfileDescriptor = classroomContext?.profileDescriptor ?? profileDescriptor;
  const compactDescriptor = effectiveProfileDescriptor.split("·")[0]?.trim() ?? effectiveProfileDescriptor;
  const useCompactProfile = role === "student" || hideProfileDescriptor || Boolean(classroomContext);
  const showProfileDescriptor = !useCompactProfile && !classroomContext?.hideProfileDescriptor && compactDescriptor.length > 0;
  const shouldShowBrandLogo = classroomContext ? true : showBrandLogo;
  const profileLinkClassName = classroomContext ? "gap-2.5 rounded-xl px-0.5" : "gap-3 rounded-2xl px-1";
  const avatarClassName = classroomContext
    ? "size-9 ring-1 ring-primary/10 transition-all duration-150 group-hover:ring-primary/20 group-hover:shadow-[0_6px_14px_rgba(91,132,255,0.1)] sm:size-10"
    : "size-10 ring-2 ring-primary/10 transition-all duration-150 group-hover:ring-primary/20 group-hover:shadow-[0_8px_20px_rgba(91,132,255,0.12)] sm:size-11";
  const profileNameClassName = useCompactProfile
    ? "truncate text-sm font-semibold text-foreground transition-colors duration-150 group-hover:text-primary"
    : "truncate text-base font-semibold text-foreground transition-colors duration-150 group-hover:text-primary";
  const profileDescriptorClassName = classroomContext
    ? "truncate text-xs text-muted-foreground transition-colors duration-150 group-hover:text-foreground/70"
    : "truncate text-sm text-muted-foreground transition-colors duration-150 group-hover:text-foreground/70";

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/92 backdrop-blur">
      <div className="flex min-h-16 items-start justify-between gap-3 px-3 py-3 sm:min-h-20 sm:items-center sm:gap-4 sm:px-5 sm:py-4 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 size-10 shrink-0 rounded-full text-foreground hover:bg-secondary sm:mt-0 lg:hidden"
            aria-label="메뉴 열기"
            onClick={onOpenMobileNav}
          >
            <Menu className="size-5" />
          </Button>
          {classroomContext ? (
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {shouldShowBrandLogo ? (
                <Link
                  href="/"
                  aria-label="홈으로 이동"
                  className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                >
                  <BrandLogo size="header" className="h-6 max-w-[104px] sm:h-8 sm:max-w-[124px]" />
                </Link>
              ) : null}
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-lg">
                  {classroomContext.title}
                  {classroomContext.subtitle ? (
                    <span className="ml-1.5 text-xs font-medium text-muted-foreground sm:ml-2 sm:text-base">/ {classroomContext.subtitle}</span>
                  ) : null}
                </p>
              </div>
            </div>
          ) : shouldShowBrandLogo ? (
            <Link
              href="/"
              aria-label="홈으로 이동"
              className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
            >
              <BrandLogo size="header" />
            </Link>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 self-center sm:gap-4">
          {classroomContext ? (
            classroomContext.actions ? <div className="hidden items-center gap-2.5 xl:flex">{classroomContext.actions}</div> : null
          ) : role === "student" ? (
            <JoinClassDialog iconOnly />
          ) : (
            <CreateClassDialog iconOnly />
          )}
          <div
            className={`group flex items-center py-1 ${profileLinkClassName}`}
            aria-label="프로필 표시"
          >
            <Avatar className={avatarClassName}>
                <AvatarFallback
                  className="bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)] text-transparent"
                  aria-hidden="true"
                >
                  {effectiveProfileName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            <div className="hidden min-w-0 md:block">
              <p className={profileNameClassName}>{effectiveProfileName}</p>
              {showProfileDescriptor ? (
                <p className={profileDescriptorClassName}>{compactDescriptor}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {classroomContext?.actions ? (
        <div className="flex gap-2.5 overflow-x-auto px-3 pb-3 sm:px-5 xl:hidden [&::-webkit-scrollbar]:hidden">
          {classroomContext.actions}
        </div>
      ) : null}
    </header>
  );
}
