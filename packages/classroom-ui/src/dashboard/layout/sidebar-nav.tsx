"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, Layers3, LogOut, Menu, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { cn } from "../../lib/utils";

type DashboardRole = "student" | "teacher";

type SidebarNavProps = {
  role: DashboardRole;
  nickname: string;
  descriptor: string;
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  className?: string;
};

const navConfig = {
  student: [
    { href: "/classes", label: "등록한 수업", icon: BookMarked },
    { href: "/settings", label: "설정", icon: Settings },
  ],
  teacher: [
    { href: "/classes", label: "만든 수업", icon: Layers3 },
    { href: "/settings", label: "설정", icon: Settings },
  ],
} as const;

export function SidebarNav({
  role,
  nickname,
  descriptor,
  collapsed = false,
  onToggle,
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();
  const items = navConfig[role];
  const compactDescriptor = descriptor.split("·")[0]?.trim() ?? descriptor;
  const showDescriptor = role !== "student";

  return (
    <aside
      className={cn(
        "sticky top-0 flex min-h-svh w-full flex-col bg-sidebar py-4 transition-[padding] duration-300 ease-in-out sm:py-6",
        collapsed ? "items-center px-3" : "px-4 sm:px-5",
        className,
      )}
    >
      <div className="space-y-5">
        <div className={cn("sticky top-0 z-10 space-y-4 bg-sidebar pb-4", collapsed ? "px-0" : "px-1 sm:px-2")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-foreground hover:bg-secondary",
              collapsed ? "size-12 rounded-sm sm:size-14" : "size-11 rounded-sm",
            )}
            aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            onClick={onToggle}
          >
            <Menu className="size-6" />
          </Button>
        </div>
        <nav className={cn("space-y-1", collapsed && "pt-2")}>
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  collapsed
                    ? "size-12 rounded-[20px] px-0 sm:size-14"
                    : "h-12 w-full justify-start rounded-2xl px-4 text-sm",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent" : "text-sidebar-foreground hover:bg-accent",
                )}
              >
                <Link href={item.href} onClick={onNavigate}>
                  <Icon className="size-4 shrink-0" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className={cn("mt-auto space-y-4", collapsed && "w-full")}>
        {!collapsed ? (
          <>
            <div className="px-1 py-1">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-11 ring-3 ring-primary/8 sm:size-12">
                  <AvatarFallback className="bg-[radial-gradient(circle_at_30%_30%,#edf3ff_0%,#dbe5ff_58%,#c6d5ff_100%)] text-transparent" aria-hidden="true" />
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-tight text-foreground">{nickname}</p>
                  {showDescriptor ? <p className="mt-1 truncate text-sm leading-none text-muted-foreground">{compactDescriptor}</p> : null}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start rounded-2xl hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-[20px] text-sidebar-foreground hover:bg-red-50 hover:text-red-600 sm:size-14"
          >
            <LogOut className="size-5" />
          </Button>
        )}
      </div>
    </aside>
  );
}
