"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookMarked, Layers3, LogOut, Menu, Settings } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { cn } from "../../lib/utils";

type DashboardRole = "student" | "teacher";

type SidebarNavProps = {
  role: DashboardRole;
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
  collapsed = false,
  onToggle,
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();
  const items = navConfig[role];
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);

  async function handleLogout() {
    if (logoutPending) {
      return;
    }

    setLogoutPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      const webBaseUrl = process.env.NEXT_PUBLIC_WEB ? process.env.NEXT_PUBLIC_WEB.replace(/\/$/, "") : "";
      window.location.assign(webBaseUrl || "/");
    }
  }

  function requestLogout() {
    setLogoutDialogOpen(true);
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex min-h-svh w-full flex-col bg-sidebar py-4 transition-[padding] duration-300 ease-in-out sm:py-5",
        collapsed ? "items-center px-2.5 sm:px-3" : "px-3.5 sm:px-4",
        className,
      )}
    >
      <div className="space-y-4 sm:space-y-5">
        <div className={cn("sticky top-0 z-10 space-y-3 bg-sidebar pb-4", collapsed ? "px-0" : "px-0.5 sm:px-1.5")}>
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
        <nav className={cn("space-y-1.5", collapsed && "pt-2")}>
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
                    : "h-11 w-full justify-start rounded-2xl px-3.5 text-sm sm:h-12 sm:px-4",
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
          <Button
            variant="outline"
            disabled={logoutPending}
            onClick={requestLogout}
            className="h-11 w-full justify-start rounded-2xl hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:h-12"
          >
            <LogOut className="size-4" />
            {logoutPending ? "로그아웃 중..." : "로그아웃"}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            disabled={logoutPending}
            onClick={requestLogout}
            className="size-12 rounded-[20px] text-sidebar-foreground hover:bg-red-50 hover:text-red-600 sm:size-14"
          >
            <LogOut className="size-5" />
          </Button>
        )}
      </div>
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:w-[min(92vw,28rem)]">
          <DialogHeader>
            <DialogTitle>로그아웃할까요?</DialogTitle>
            <DialogDescription>
              현재 계정의 로그인 상태가 해제되고 시작 화면으로 이동합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={logoutPending}>
                취소
              </Button>
            </DialogClose>
            <Button type="button" disabled={logoutPending} onClick={handleLogout}>
              {logoutPending ? "로그아웃 중..." : "로그아웃"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
