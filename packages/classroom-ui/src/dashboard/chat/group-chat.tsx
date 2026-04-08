"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { MoreHorizontal, PencilLine, SendHorizontal, Trash2, X } from "lucide-react";

import type { GroupSummary } from "../../lib/mock-data";
import { cn, getAvatarToneClass } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "../../ui/textarea";

type GroupChatProps = {
  group: GroupSummary;
  showHeader?: boolean;
  className?: string;
};

const MAX_COMPOSER_HEIGHT = 360;
const OWN_AVATAR_TONE_CLASS = "bg-[radial-gradient(circle_at_30%_30%,#eef4ff_0%,#dbe6ff_58%,#c6d6ff_100%)]";

export function GroupChat({ group, showHeader = true, className }: GroupChatProps) {
  const [draft, setDraft] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
  }, [draft]);

  useEffect(() => {
    if (!openMenuId) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-message-menu-root='true']")) return;
      setOpenMenuId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  return (
    <Card className={cn("overflow-hidden bg-white/95", className)}>
      {showHeader ? (
        <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle>{group.name} 전체 채팅</CardTitle>
          <CardDescription>{group.topic}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent className="p-0">
        <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,251,255,0.96)_0%,rgba(244,247,252,0.96)_100%)]">
          <div className="space-y-4 p-3 sm:p-6 lg:space-y-5 lg:p-7">
            {group.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "group relative -mx-3 flex items-start gap-2 px-3 py-2 transition-colors sm:-mx-6 sm:gap-3 sm:px-6 lg:-mx-7 lg:px-7",
                  message.own ? "justify-end" : "justify-start",
                  message.id !== group.messages[0]?.id ? "mt-3 sm:mt-4 lg:mt-5" : "",
                  openMenuId === message.id ? "bg-slate-950/[0.04]" : "hover:bg-slate-950/[0.04]",
                )}
              >
                {message.own ? (
                  <div data-message-menu-root="true" className="absolute top-1 right-1 z-20 sm:top-2 sm:right-6 lg:right-7">
                    <button
                      type="button"
                      aria-label="메시지 메뉴"
                      aria-expanded={openMenuId === message.id}
                      aria-haspopup="menu"
                      onClick={() => setOpenMenuId((current) => current === message.id ? null : message.id)}
                      className={cn(
                        "rounded-full border border-border/80 bg-white/95 p-1.5 text-muted-foreground opacity-100 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-150 hover:-translate-y-0.5 hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
                        openMenuId === message.id ? "opacity-100" : "",
                      )}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {openMenuId === message.id ? (
                      <div
                        role="menu"
                        className="absolute top-10 right-0 min-w-32 overflow-hidden rounded-2xl border border-border/70 bg-white/98 p-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(null)}
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-secondary/80"
                        >
                          <PencilLine className="size-4" />
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(null)}
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive transition hover:bg-destructive/5"
                        >
                          <Trash2 className="size-4" />
                          삭제
                        </button>
                        <div className="my-1 h-px bg-border/70" />
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(null)}
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/80"
                        >
                          <X className="size-4" />
                          취소
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {!message.own ? (
                  <Avatar className="mt-1 size-9 shrink-0 bg-secondary sm:size-11">
                    <AvatarFallback
                      className={cn("text-transparent", getAvatarToneClass(message.author))}
                      aria-hidden="true"
                    >
                      {message.author.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <div
                  className={cn(
                    "relative w-fit max-w-[min(100%,22rem)] break-words rounded-[24px] border px-4 py-3 text-sm leading-7 shadow-none sm:max-w-[86%] sm:px-5 sm:py-4 sm:text-base sm:leading-8 lg:px-6 lg:py-5",
                    message.own
                      ? "border-primary/15 bg-[linear-gradient(180deg,rgba(247,250,255,0.98)_0%,rgba(239,245,255,0.98)_100%)] text-foreground sm:max-w-[72%]"
                      : "border-border/60 bg-white text-foreground",
                  )}
                >
                  <div
                    className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm"
                  >
                    <span className="font-semibold">{message.author}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="break-words text-left">{message.content}</p>
                </div>
                {message.own ? (
                  <Avatar className="mt-1 size-9 shrink-0 bg-secondary sm:size-11">
                    <AvatarFallback className={cn("text-transparent", OWN_AVATAR_TONE_CLASS)} aria-hidden="true">
                      {message.author.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-border/70 bg-white p-4 shadow-none sm:p-5 lg:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <Textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value)}
                placeholder="메시지를 입력하세요."
                className="max-h-[360px] min-h-14 flex-1 resize-none overflow-y-auto rounded-none border-0 px-0 py-3 text-sm leading-7 shadow-none focus-visible:ring-0 sm:min-h-16 sm:py-3.5 sm:text-base"
              />
              <Button size="lg" disabled={!draft.trim()} className="w-full shrink-0 sm:w-auto sm:min-w-28 sm:self-end">
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
