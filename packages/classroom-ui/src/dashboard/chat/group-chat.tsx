"use client";

import { useEffect, useRef, type ChangeEvent, type CompositionEvent, type KeyboardEvent } from "react";
import { ArrowUp, Loader2, RotateCcw, Sparkles } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "../../ui/textarea";

export type GroupChatMessage = {
  id: string;
  author: string;
  time: string;
  content: string;
  own?: boolean;
};

export type GroupChatConnectionState = "idle" | "connecting" | "joined" | "error";

type GroupChatProps = {
  title: string;
  description?: string;
  messages: GroupChatMessage[];
  draft: string;
  connectionState?: GroupChatConnectionState;
  errorMessage?: string | null;
  sendPending?: boolean;
  onRequestAdvice?: () => void;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRetry?: () => void;
  showHeader?: boolean;
  className?: string;
};

const MAX_COMPOSER_HEIGHT = 360;

function getConnectionLabel(connectionState: GroupChatConnectionState) {
  switch (connectionState) {
    case "connecting":
      return "연결 중";
    case "joined":
      return "연결됨";
    case "error":
      return "오류";
    default:
      return "대기 중";
  }
}

export function GroupChat({
  title,
  description,
  messages,
  draft,
  connectionState = "idle",
  errorMessage,
  sendPending = false,
  onRequestAdvice,
  onDraftChange,
  onSend,
  onRetry,
  showHeader = true,
  className,
}: GroupChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const canSend = draft.trim().length > 0 && connectionState === "joined" && !sendPending;
  const canRequestAdvice = draft.trim().length > 0 && connectionState === "joined" && !sendPending;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
  }, [draft]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current || event.nativeEvent.isComposing) {
      return;
    }

    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (canSend) {
      onSend();
    }
  };

  const handleCompositionStart = (_event: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (_event: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
  };

  return (
    <Card
      className={cn(
        "flex h-full min-h-[28rem] max-h-full flex-col overflow-hidden bg-white/95 sm:min-h-[32rem] xl:min-h-0",
        className,
      )}
    >
      {showHeader ? (
        <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                connectionState === "joined"
                  ? "bg-emerald-50 text-emerald-700"
                  : connectionState === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600",
              )}
            >
              {getConnectionLabel(connectionState)}
            </span>
          </div>
        </CardHeader>
      ) : null}
      <CardContent className="flex min-h-0 flex-1 p-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(249,251,255,0.96)_0%,rgba(244,247,252,0.96)_100%)]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="space-y-2.5 p-2.5 sm:p-3.5 lg:space-y-3 lg:p-4">
              {messages.length === 0 ? (
                <div className="flex min-h-56 items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 text-center text-sm text-slate-500">
                  아직 메시지가 없습니다. 첫 메시지를 보내 대화를 시작해 보세요.
                </div>
              ) : null}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "relative -mx-2 flex items-start px-2 py-1.5 transition-colors sm:-mx-3 sm:px-3 lg:-mx-4 lg:px-4",
                    message.own ? "justify-end" : "justify-start",
                    "hover:bg-slate-950/[0.04]",
                  )}
                >
                  <div className="relative min-w-0 self-stretch">
                    <div
                      className={cn(
                        "flex min-w-0 max-w-[min(48rem,100%)] flex-col gap-1.5",
                        message.own ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-[11px] text-muted-foreground sm:text-xs",
                          message.own ? "justify-end text-right" : "justify-start text-left",
                        )}
                      >
                        <span className="font-semibold text-foreground/80">{message.author}</span>
                        <span>{message.time}</span>
                      </div>
                      <div className="relative min-w-0 self-stretch">
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
                            "relative z-10 break-words border border-[#d6deef] bg-white/98 px-4 py-2.5 text-xs leading-5 text-foreground shadow-[0_18px_42px_rgba(148,163,184,0.14),0_2px_8px_rgba(15,23,42,0.04)] sm:px-5 sm:py-3 sm:text-sm sm:leading-6 lg:px-6 lg:py-3.5",
                            message.own ? "rounded-[26px] rounded-br-[16px]" : "rounded-[26px] rounded-bl-[16px]",
                          )}
                        >
                          <p className="break-words text-left">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-border/70 bg-white/95 px-3.5 py-3 shadow-none backdrop-blur sm:px-5 sm:py-3.5 lg:px-6 lg:py-4">
            {connectionState === "error" || errorMessage ? (
              <div className="mb-2.5 flex items-center justify-between gap-3 text-xs">
                <span className="text-red-600">{errorMessage || "채팅 연결에 실패했습니다."}</span>
                {onRetry ? (
                  <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onRetry}>
                    <RotateCcw className="mr-1 size-3.5" />
                    다시 연결
                  </Button>
                ) : null}
              </div>
            ) : null}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <Textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onDraftChange(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="메시지를 입력하세요."
                className="max-h-[360px] min-h-8 flex-1 resize-none overflow-y-auto rounded-none border-0 px-0 py-0.5 text-sm leading-6 shadow-none focus-visible:ring-0 sm:min-h-9 sm:text-[15px]"
              />
              {onRequestAdvice ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canRequestAdvice}
                  className="h-10 shrink-0 rounded-[18px] border-primary/20 px-4 text-sm font-semibold text-primary shadow-none hover:bg-primary/5 sm:h-11"
                  onClick={onRequestAdvice}
                >
                  <Sparkles className="mr-2 size-4" />
                  AI 조언
                </Button>
              ) : null}
              <Button
                type="button"
                size="icon"
                aria-label="메시지 전송"
                disabled={!canSend}
                className="size-10 shrink-0 rounded-full shadow-sm sm:size-11"
                onClick={onSend}
              >
                {sendPending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
