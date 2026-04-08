"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, House, Layers3, LogOut, Menu, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "../lib/utils";
import { BrandLogo } from "./brand-logo";

type DashboardRole = "student" | "teacher";

type SidebarNavProps = {
  role: DashboardRole;
  nickname: string;
  descriptor: string;
  footerNote: string;
  collapsed?: boolean;
  onToggle?: () => void;
};

const navConfig = {
  student: [
    { href: "/", label: "홈", icon: House },
    { href: "/classes", label: "등록한 수업", icon: BookMarked },
    { href: "/settings", label: "설정", icon: Settings }
  ],
  teacher: [
    { href: "/", label: "홈", icon: House },
    { href: "/classes", label: "만든 수업", icon: Layers3 },
    { href: "/settings", label: "설정", icon: Settings }
  ]
} as const;

export function SidebarNav({
  role,
  nickname,
  descriptor,
  footerNote,
  collapsed = false,
  onToggle,
}: SidebarNavProps) {
  const pathname = usePathname();
  const items = navConfig[role];

  return (
    <aside
      className={cn(
        "sticky top-0 flex min-h-svh w-full flex-col bg-sidebar py-6 transition-[padding] duration-300 ease-in-out",
        collapsed ? "items-center px-3" : "px-5"
      )}
    >
      <div className="space-y-5">
        <div className={cn("sticky top-0 z-10 space-y-4 bg-sidebar pb-4", collapsed ? "px-0" : "px-2")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-foreground hover:bg-secondary",
              collapsed ? "size-14 rounded-sm" : "size-11 rounded-sm"
            )}
            aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            onClick={onToggle}
          >
            <Menu className="size-6" />
          </Button>
          {!collapsed ? (
            <>
              <BrandLogo size="sidebar" />
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {role === "student" ? "수강생 워크스페이스" : "교강사 워크스페이스"}
              </Badge>
            </>
          ) : null}
        </div>
        <nav className={cn("space-y-1", collapsed && "pt-2")}>
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  collapsed
                    ? "size-14 rounded-[20px] px-0"
                    : "h-12 w-full justify-start rounded-2xl px-4 text-sm",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent" : "text-sidebar-foreground hover:bg-accent"
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {!collapsed ? item.label : null}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className={cn("mt-auto space-y-4", collapsed && "w-full")}>
        {!collapsed ? (
          <>
            <Card className="border-primary/10 bg-linear-to-br from-white to-secondary/50 shadow-none">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 ring-4 ring-primary/10">
                    <AvatarFallback>{nickname.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{nickname}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{descriptor}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{footerNote}</p>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full justify-start rounded-2xl">
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="icon" className="size-14 rounded-[20px] text-sidebar-foreground hover:bg-accent">
            <LogOut className="size-5" />
          </Button>
        )}
      </div>
    </aside>
  );
}
