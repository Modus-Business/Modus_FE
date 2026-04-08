import { Card, CardContent } from "@modus/classroom-ui";

export default function Loading() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
      <Card className="bg-white/95">
        <CardContent className="space-y-4 p-6">
          <div className="h-10 w-64 animate-pulse rounded-full bg-muted" />
          <div className="h-72 animate-pulse rounded-[28px] bg-muted" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-44 animate-pulse rounded-[28px] bg-muted" />
            <div className="h-44 animate-pulse rounded-[28px] bg-muted" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/95">
        <CardContent className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-[28px] bg-muted" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
