"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowUp, MoreHorizontal, PencilLine, Trash2, X } from "lucide-react";

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
    <Card
      className={cn(
        "flex h-full min-h-[28rem] flex-col overflow-hidden bg-white/95 sm:min-h-[32rem] xl:min-h-0",
        className,
      )}
    >
      {showHeader ? (
        <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle>{group.name} 전체 채팅</CardTitle>
          <CardDescription>{group.topic}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent className="flex min-h-0 flex-1 p-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(249,251,255,0.96)_0%,rgba(244,247,252,0.96)_100%)]">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2.5 p-2.5 sm:p-3.5 lg:space-y-3 lg:p-4">
            {group.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "group relative -mx-2 flex items-start gap-1.5 px-2 py-1.5 transition-colors sm:-mx-3 sm:gap-2 sm:px-3 lg:-mx-4 lg:px-4",
                  message.own ? "justify-end" : "justify-start",
                  openMenuId === message.id ? "bg-slate-950/[0.04]" : "hover:bg-slate-950/[0.04]",
                )}
              >
                {message.own ? (
                  <div data-message-menu-root="true" className="absolute top-1 right-1 z-20 sm:top-2 sm:right-5 lg:right-7">
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
                        className="absolute right-full bottom-full mr-2 mb-2 min-w-32 overflow-hidden rounded-2xl border border-border/70 bg-white/98 p-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur"
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
                    "relative min-w-0 max-w-[calc(100%-3rem)] sm:max-w-[calc(100%-4.25rem)] lg:max-w-[min(48rem,calc(100%-5rem))]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute bottom-[18px] z-0 block size-5 bg-white/98 shadow-[0_12px_24px_rgba(15,23,42,0.06)]",
                      message.own
                        ? "right-4 translate-x-[58%] rotate-[34deg] rounded-br-[15px] border-r border-b border-[#d6deef]"
                        : "left-4 -translate-x-[58%] -rotate-[34deg] rounded-bl-[15px] border-l border-b border-[#d6deef]",
                    )}
                  />
                  <div
                    className={cn(
                      "relative z-10 break-words border border-[#d6deef] bg-white/98 px-4 py-3 text-xs leading-6 text-foreground shadow-[0_18px_42px_rgba(148,163,184,0.14),0_2px_8px_rgba(15,23,42,0.04)] sm:px-5 sm:py-4 sm:text-sm sm:leading-7 lg:px-6 lg:py-5",
                      message.own ? "rounded-[26px] rounded-br-[16px]" : "rounded-[26px] rounded-bl-[16px]",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs",
                        message.own ? "justify-end text-right" : "justify-start text-left",
                      )}
                    >
                      <span className="font-semibold">{message.author}</span>
                      <span>{message.time}</span>
                    </div>
                    <p className="break-words text-left">{message.content}</p>
                  </div>
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
          </div>

          <div className="sticky bottom-0 z-10 border-t border-border/70 bg-white/95 px-3.5 py-3 shadow-none backdrop-blur sm:px-5 sm:py-3.5 lg:px-6 lg:py-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <Textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value)}
                placeholder="메시지를 입력하세요."
                className="max-h-[360px] min-h-8 flex-1 resize-none overflow-y-auto rounded-none border-0 px-0 py-0.5 text-sm leading-6 shadow-none focus-visible:ring-0 sm:min-h-9 sm:text-[15px]"
              />
              <Button
                type="button"
                size="icon"
                aria-label="메시지 전송"
                disabled={!draft.trim()}
                className="size-10 shrink-0 rounded-full shadow-sm sm:size-11"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
