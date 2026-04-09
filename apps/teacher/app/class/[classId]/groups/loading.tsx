import { Card, CardContent } from "@modus/classroom-ui";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Card className="bg-white/95">
        <CardContent className="space-y-4 p-6">
          <div className="h-10 w-48 animate-pulse rounded-full bg-muted" />
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="h-64 animate-pulse rounded-[28px] bg-muted" />
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-[28px] bg-muted" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/95">
        <CardContent className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] bg-muted" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
