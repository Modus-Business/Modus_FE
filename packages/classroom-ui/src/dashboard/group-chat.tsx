import { SendHorizontal } from "lucide-react";

import type { GroupSummary } from "../lib/mock-data";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

type GroupChatProps = {
  group: GroupSummary;
};

export function GroupChat({ group }: GroupChatProps) {
  return (
    <Card className="overflow-hidden bg-white/95">
      <CardHeader className="border-b border-border/70">
        <CardTitle>{group.name} 전체 채팅</CardTitle>
        <CardDescription>{group.topic}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-3 border border-border/50 bg-background/80 p-3">
          {group.messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.own ? "justify-end" : "justify-start")}>
              {!message.own ? (
                <Avatar className="mt-1 size-9">
                  <AvatarFallback>{message.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ) : null}
              <div className={cn("max-w-[82%] border border-border/50 px-4 py-3 text-sm leading-6 shadow-none", message.own ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground")}>
                <div className={cn("mb-1 flex items-center gap-2 text-xs", message.own ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  <span className="font-medium">{message.author}</span>
                  <span>{message.handle}</span>
                  <span>{message.time}</span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border/70 bg-white p-3 shadow-none">
          <Textarea disabled placeholder="퍼블리싱 단계에서는 채팅 입력 UI만 제공합니다." className="min-h-24 resize-none border-0 bg-transparent px-1 py-1 shadow-none focus-visible:ring-0" />
          <div className="flex justify-end">
            <Button size="sm" disabled>
              <SendHorizontal className="size-4" />
              전송
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
