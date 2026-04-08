import { Sparkles } from "lucide-react";

import { Card, CardContent } from "../../ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-primary/20 bg-linear-to-br from-white to-secondary/40">
      <CardContent className="flex flex-col items-center gap-4 px-5 py-8 text-center sm:px-6 sm:py-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Sparkles className="size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="max-w-3xl break-keep text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
