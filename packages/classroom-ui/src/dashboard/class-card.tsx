import Link from "next/link";
import { ArrowUpRight, CalendarClock, Hash, UsersRound } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

type ClassCardProps = {
  href: string;
  name: string;
  code: string;
  schedule: string;
  description: string;
  metaLabel: string;
  metaValue: string;
  footerLabel?: string;
  footerValue?: string;
};

export function ClassCard({ href, name, code, schedule, description, metaLabel, metaValue, footerLabel, footerValue }: ClassCardProps) {
  return (
    <Card className="flex h-full flex-col border-border/80 bg-white/95">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{code}</Badge>
          <Button asChild size="icon" variant="ghost" className="size-9">
            <Link href={href} aria-label={`${name} 열기`}>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          <span>{schedule}</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersRound className="size-4 text-primary" />
          <span>{metaLabel} · {metaValue}</span>
        </div>
        {footerLabel && footerValue ? (
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-primary" />
            <span>{footerLabel} · {footerValue}</span>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={href}>자세히 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
