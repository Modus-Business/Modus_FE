"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  GroupChat,
  type GroupSummary,
} from "@modus/classroom-ui";

import { useGroupChat } from "../../../hooks/use-group-chat";

function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function StudentGroupChatPanel({ group, className }: { group: GroupSummary; className?: string }) {
  const {
    connectionState,
    draft,
    errorMessage,
    messages,
    nickname,
    adviceDialogOpen,
    advicePending,
    adviceRequestMode,
    pendingAdvice,
    applyAdviceSuggestion,
    confirmSendMessage,
    dismissAdvice,
    requestInterventionAdvice,
    retry,
    sendMessage,
    setDraft,
  } = useGroupChat(group.id);

  const chatMessages = useMemo(
    () =>
      messages.map((message) => ({
        id: message.messageId,
        author: message.nickname,
        content: message.content,
        time: formatMessageTime(message.sentAt),
        own: nickname !== "" && message.nickname === nickname,
      })),
    [messages, nickname],
  );

  const primaryWarning = pendingAdvice?.warnings[0] || "";
  const showHighlightedWarning = primaryWarning.length > 0;
  const showBodyMessage = (pendingAdvice?.message || "").trim() !== primaryWarning.trim();

  return (
    <>
      <GroupChat
        title={`${group.name} 전체 채팅`}
        description={group.topic || "모둠 실시간 채팅"}
        messages={chatMessages}
        draft={draft}
        connectionState={connectionState}
        errorMessage={errorMessage}
        sendPending={advicePending}
        onRequestAdvice={requestInterventionAdvice}
        onDraftChange={setDraft}
        onSend={sendMessage}
        onRetry={retry}
        showHeader={false}
        className={className}
      />

      <Dialog
        open={adviceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            dismissAdvice();
          }
        }}
      >
        <DialogContent className="w-[min(92vw,38rem)] rounded-[26px] p-0">
          <div className="space-y-5 px-6 py-6 sm:px-7 sm:py-7">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="mr-1.5 size-3.5" />
                {adviceRequestMode === "send" ? "AI 메시지 조언" : "AI 개입 조언"}
              </span>
              <DialogHeader className="gap-2">
                <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                  {adviceRequestMode === "send"
                    ? pendingAdvice?.blocked
                      ? "전송하기 전에 수정이 필요해요"
                      : "전송하기 전에 한 번 확인해 보세요"
                    : "대화에 이렇게 개입해 보면 어때요?"}
                </DialogTitle>
                <DialogDescription className="text-base leading-7 text-muted-foreground">
                  {adviceRequestMode === "send"
                    ? pendingAdvice?.blocked
                      ? "이 문장은 바로 전송되지 않아요. 수정안을 적용하거나 다듬고 다시 작성해 주세요."
                      : "조금 더 부드럽게 전달할 수 있도록 AI 조언을 확인해 보세요."
                    : "최근 그룹 대화를 바탕으로 참여 유도와 논의 심화를 위한 개입 문구를 제안해 드려요."}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {pendingAdvice?.riskLabel || (pendingAdvice?.blocked ? "수정 필요" : "위험도 낮음")}
              </span>

              {showHighlightedWarning ? (
                <div className="rounded-[18px] border border-[#f1d29a] bg-[#fff7e8] px-4 py-4 text-base font-semibold text-[#8c6621]">
                  {primaryWarning}
                </div>
              ) : null}

              {showBodyMessage ? (
                <p className="text-base leading-7 text-muted-foreground">
                  {adviceRequestMode === "send"
                    ? pendingAdvice?.message || "메시지 내용을 한 번 더 확인해 주세요."
                    : pendingAdvice?.message || "현재 대화에 도움이 될 개입 방향을 확인해 보세요."}
                </p>
              ) : null}
            </div>

            {pendingAdvice?.suggestion ? (
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">추천 문장</p>
                <div className="rounded-[18px] border border-primary/15 bg-primary/5 px-4 py-4 text-lg font-semibold text-foreground">
                  {pendingAdvice.suggestion}
                </div>
              </div>
            ) : null}

            {pendingAdvice?.warnings.length && pendingAdvice.warnings.length > 1 ? (
              <div className="space-y-2">
                {pendingAdvice.warnings.slice(1).map((warning, index) => (
                  <p key={`${warning}-${index}`} className="text-sm leading-6 text-muted-foreground">
                    {warning}
                  </p>
                ))}
              </div>
            ) : null}

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" className="text-base text-muted-foreground" onClick={dismissAdvice}>
                {adviceRequestMode === "send" ? "다시 쓸게요" : "닫기"}
              </Button>
              {pendingAdvice?.suggestion ? (
                <Button type="button" className="h-12 rounded-[16px] px-6 text-base" onClick={applyAdviceSuggestion}>
                  수정안 적용
                </Button>
              ) : null}
              {!pendingAdvice?.blocked && adviceRequestMode === "send" ? (
                <Button type="button" className="h-12 rounded-[16px] px-6 text-base" onClick={confirmSendMessage}>
                  그대로 보내기
                </Button>
              ) : null}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
