import Link from "next/link";
import { ArrowUpRight, CalendarClock, Hash, UsersRound } from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";

type ClassCardProps = {
  href: string;
  name: string;
  code?: string;
  schedule?: string;
  description: string;
  metaLabel?: string;
  metaValue?: string;
  footerLabel?: string;
  footerValue?: string;
};

export function ClassCard({ href, name, code, schedule, description, metaLabel, metaValue, footerLabel, footerValue }: ClassCardProps) {
  return (
    <Card className="relative flex h-full flex-col border-border/80 bg-white/95">
      <Button asChild size="icon" variant="ghost" className="absolute top-3.5 right-3.5 z-10 size-9 sm:top-5 sm:right-5">
        <Link href={href} aria-label={`${name} 열기`}>
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
      <CardHeader className="space-y-3.5 pr-12 sm:space-y-4 sm:pr-16">
        {code ? <Badge variant="secondary">{code}</Badge> : null}
        <div className="min-w-0">
          <CardTitle className="break-keep pr-1 text-lg leading-snug sm:text-xl">{name}</CardTitle>
          <CardDescription className="mt-2 break-keep text-sm leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pr-4 text-sm leading-6 text-muted-foreground sm:pr-16">
        {schedule ? (
          <div className="flex items-start gap-2">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="break-keep">{schedule}</span>
          </div>
        ) : null}
        {metaLabel && metaValue ? (
          <div className="flex items-start gap-2">
            <UsersRound className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="break-keep">{metaLabel} · {metaValue}</span>
          </div>
        ) : null}
        {footerLabel && footerValue ? (
          <div className="flex items-start gap-2">
            <Hash className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="break-keep">{footerLabel} · {footerValue}</span>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto pt-2 pr-4 sm:pr-16">
        <Button asChild className="h-11 w-full rounded-xl">
          <Link href={href}>자세히 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
