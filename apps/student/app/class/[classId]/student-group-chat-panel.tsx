"use client";

import { useMemo } from "react";

import { GroupChat, type GroupSummary } from "@modus/classroom-ui";

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
  const { connectionState, draft, errorMessage, messages, nickname, retry, sendMessage, setDraft } = useGroupChat(group.id);

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

  return (
    <GroupChat
      title={`${group.name} 전체 채팅`}
      description={group.topic || "모둠 실시간 채팅"}
      messages={chatMessages}
      draft={draft}
      connectionState={connectionState}
      errorMessage={errorMessage}
      onDraftChange={setDraft}
      onSend={sendMessage}
      onRetry={retry}
      showHeader={false}
      className={className}
    />
  );
}
