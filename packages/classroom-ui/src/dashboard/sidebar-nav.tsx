"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, House, Layers3, LogOut, Settings } from "lucide-react";

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

export function SidebarNav({ role, nickname, descriptor, footerNote }: SidebarNavProps) {
  const pathname = usePathname();
  const items = navConfig[role];

  return (
    <aside className="flex h-full w-full max-w-[280px] flex-col border-r border-border/70 bg-sidebar px-5 py-6">
      <div className="space-y-5">
        <div className="space-y-4 px-2">
          <div className="rounded-[22px] bg-white/80 p-3 shadow-sm ring-1 ring-primary/8">
            <BrandLogo size="sidebar" />
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {role === "student" ? "수강생 워크스페이스" : "교강사 워크스페이스"}
          </Badge>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "h-12 w-full justify-start rounded-2xl px-4 text-sm",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent" : "text-sidebar-foreground hover:bg-accent"
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-4">
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
      </div>
    </aside>
  );
}
