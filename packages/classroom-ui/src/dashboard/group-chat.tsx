"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

import type { GroupSummary } from "../lib/mock-data";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

type GroupChatProps = {
  group: GroupSummary;
  showHeader?: boolean;
  className?: string;
};

const avatarToneClasses = [
  "bg-[radial-gradient(circle_at_30%_30%,#eef3ff_0%,#d8e3ff_58%,#c4d4ff_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#effaf5_0%,#d6f4e5_58%,#b8eacb_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#fff4ef_0%,#ffe2d2_58%,#ffd0b8_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#f6f1ff_0%,#e5dbff_58%,#d3c3ff_100%)]",
];

export function GroupChat({ group, showHeader = true, className }: GroupChatProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draft]);

  return (
    <Card className={cn("overflow-hidden bg-white/95", className)}>
      {showHeader ? (
        <CardHeader className="border-b border-border/70">
          <CardTitle>{group.name} 전체 채팅</CardTitle>
          <CardDescription>{group.topic}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          "p-0",
          showHeader ? "" : "",
        )}
      >
        <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,251,255,0.96)_0%,rgba(244,247,252,0.96)_100%)]">
          <div className="space-y-4 p-4 sm:p-6 lg:space-y-5 lg:p-7">
            {group.messages.map((message, index) => (
              <div
                key={message.id}
                className={cn("flex gap-4", message.own ? "justify-end" : "justify-start", message.id !== group.messages[0]?.id ? "mt-4 lg:mt-5" : "")}
              >
                {!message.own ? (
                  <Avatar className="mt-1 size-10 bg-secondary sm:size-11">
                    <AvatarFallback
                      className={cn(
                        "text-transparent",
                        avatarToneClasses[index % avatarToneClasses.length],
                      )}
                      aria-hidden="true"
                    >
                      {message.author.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <div
                  className={cn(
                    "max-w-[86%] border px-5 py-4 text-base leading-8 shadow-none lg:px-6 lg:py-5",
                    message.own
                      ? "max-w-[72%] border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-white text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
                      message.own ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    <span className="font-semibold">{message.author}</span>
                    <span>{message.handle}</span>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/70 bg-white p-4 shadow-none sm:p-5 lg:p-6">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="메시지를 입력하세요."
              className="min-h-0 resize-none overflow-hidden rounded-none border-0 px-0 py-0 text-base leading-8 shadow-none focus-visible:ring-0"
            />
            <div className="mt-4 flex justify-end">
              <Button size="lg" disabled={!draft.trim()} className="min-w-28">
                <SendHorizontal className="size-4" />
                전송
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
