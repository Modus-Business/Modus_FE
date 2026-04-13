"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

import { studentChatApiClient } from "../lib/chat/client";
import { createChatSocket } from "../lib/chat/socket";
import type {
  ChatAdviceResult,
  ChatConnectionState,
  ChatErrorEvent,
  ChatJoinedEvent,
  ChatMessage,
  ChatSendRequest,
  ChatTokenResponse,
} from "../lib/chat/types";

type SocketConnectError = Error & {
  description?: unknown;
  context?: unknown;
  data?: { message?: string | string[] } | undefined;
};

function normalizeChatErrorMessage(error: ChatErrorEvent | Error | SocketConnectError) {
  if ("data" in error && error.data?.message) {
    if (Array.isArray(error.data.message)) {
      return error.data.message.find((entry) => typeof entry === "string" && entry.trim()) || "채팅 처리에 실패했습니다.";
    }

    if (typeof error.data.message === "string" && error.data.message.trim()) {
      return error.data.message;
    }
  }

  if ("message" in error && Array.isArray(error.message)) {
    return error.message.find((entry) => typeof entry === "string" && entry.trim()) || "채팅 처리에 실패했습니다.";
  }

  if ("message" in error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "채팅 처리에 실패했습니다.";
}

function mergeMessages(messages: ChatMessage[]) {
  const map = new Map<string, ChatMessage>();

  for (const message of messages) {
    map.set(message.messageId, message);
  }

  return [...map.values()].sort((left, right) => {
    const leftTime = new Date(left.sentAt).getTime();
    const rightTime = new Date(right.sentAt).getTime();

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return left.messageId.localeCompare(right.messageId);
    }

    return leftTime - rightTime;
  });
}

export function useGroupChat(groupId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ChatConnectionState>("idle");
  const [advicePending, setAdvicePending] = useState(false);
  const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);
  const [pendingAdvice, setPendingAdvice] = useState<(ChatAdviceResult & { content: string }) | null>(null);
  const [adviceRequestMode, setAdviceRequestMode] = useState<"send" | "intervention">("intervention");
  const [retryKey, setRetryKey] = useState(0);

  const resetState = useCallback((nextState: ChatConnectionState) => {
    setMessages([]);
    setNickname("");
    setErrorMessage(null);
    setConnectionState(nextState);
  }, []);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    socket.removeAllListeners();
    socket.disconnect();
    socketRef.current = null;
  }, []);

  useEffect(() => {
    let isDisposed = false;

    if (!groupId) {
      disconnect();
      Promise.resolve().then(() => {
        if (!isDisposed) {
          resetState("idle");
        }
      });
      return;
    }

    Promise.resolve().then(() => {
      if (!isDisposed) {
        resetState("connecting");
      }
    });

    const connectChat = async () => {
      try {
        const { data } = await studentChatApiClient.get<ChatTokenResponse>("/api/chat/token");

        if (isDisposed) {
          return;
        }

        const socket = createChatSocket(data.token);
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnectionState("joined");
          setErrorMessage(null);
          socket.emit("chat.join", { groupId });
        });

        socket.on("connect_error", (error: Error) => {
          console.error("chat connect_error", error);
          setConnectionState("error");
          setErrorMessage(normalizeChatErrorMessage(error));
        });

        socket.on("chat.joined", (payload: ChatJoinedEvent) => {
          if (payload.groupId !== groupId) {
            return;
          }

          setNickname(payload.nickname);
          setConnectionState("joined");
          setErrorMessage(null);
        });

        socket.on("chat.history", (payload: ChatMessage[]) => {
          setConnectionState("joined");
          setMessages((current) => mergeMessages([...current, ...payload]));
        });

        socket.on("chat.message", (payload: ChatMessage) => {
          if (payload.groupId !== groupId) {
            return;
          }

          setConnectionState("joined");
          setMessages((current) => mergeMessages([...current, payload]));
        });

        socket.on("chat.error", (payload: ChatErrorEvent) => {
          console.error("chat.error", payload);
          const nextMessage = normalizeChatErrorMessage(payload);

          setErrorMessage(nextMessage);

          if (payload.event === "chat.join" || payload.event === "group.closed") {
            setConnectionState("error");
          }
        });

        socket.connect();
      } catch (error) {
        setConnectionState("error");
        setErrorMessage(
          error instanceof Error && error.message.trim()
            ? error.message
            : "채팅 연결에 필요한 토큰을 가져오지 못했습니다.",
        );
      }
    };

    void connectChat();

    return () => {
      isDisposed = true;
      disconnect();
    };
  }, [disconnect, groupId, resetState, retryKey]);

  const requestMessageAdvice = useCallback(() => {
    const socket = socketRef.current;
    const content = draft.trim();

    if (!socket || !socket.connected || connectionState !== "joined" || !content || advicePending) {
      return;
    }

    const requestAdvice = async () => {
      try {
        setAdvicePending(true);
        setAdviceRequestMode("send");
        const result = await studentChatApiClient.post<ChatAdviceResult>("/api/chat/message-advice", {
          groupId,
          content,
        });

        setPendingAdvice({
          ...result.data,
          content,
        });
        setAdviceDialogOpen(true);
      } catch (error) {
        toast.error(normalizeChatErrorMessage(error as Error));
        socket.emit("chat.send", { content } satisfies ChatSendRequest);
        setDraft("");
      } finally {
        setAdvicePending(false);
      }
    };

    void requestAdvice();
  }, [advicePending, connectionState, draft, groupId]);

  const requestInterventionAdvice = useCallback(() => {
    const socket = socketRef.current;
    const content = draft.trim();
    if (!socket || !socket.connected || connectionState !== "joined" || advicePending) {
      return;
    }

    const requestAdvice = async () => {
      try {
        setAdvicePending(true);
        setAdviceRequestMode("intervention");
        const result = await studentChatApiClient.post<ChatAdviceResult>("/api/chat/intervention-advice", {
          groupId,
        });

        setPendingAdvice({
          ...result.data,
          content,
        });
        setAdviceDialogOpen(true);
      } catch (error) {
        toast.error(normalizeChatErrorMessage(error as Error));
      } finally {
        setAdvicePending(false);
      }
    };

    void requestAdvice();
  }, [advicePending, connectionState, draft, groupId]);

  const sendMessage = useCallback(() => {
    requestMessageAdvice();
  }, [requestMessageAdvice]);

  const confirmSendMessage = useCallback(() => {
    const socket = socketRef.current;

    if (!socket || !socket.connected || connectionState !== "joined" || !pendingAdvice?.content) {
      return;
    }

    socket.emit("chat.send", { content: pendingAdvice.content } satisfies ChatSendRequest);
    setDraft("");
    setPendingAdvice(null);
    setAdviceDialogOpen(false);
  }, [connectionState, pendingAdvice]);

  const applyAdviceSuggestion = useCallback(() => {
    if (!pendingAdvice?.suggestion) {
      return;
    }

    setDraft(pendingAdvice.suggestion);
    setAdviceDialogOpen(false);
    setPendingAdvice(null);
    setAdviceRequestMode("intervention");
  }, [pendingAdvice]);

  const dismissAdvice = useCallback(() => {
    setAdviceDialogOpen(false);
    setPendingAdvice(null);
    setAdviceRequestMode("intervention");
  }, []);

  const retry = useCallback(() => {
    disconnect();
    setRetryKey((current) => current + 1);
  }, [disconnect]);

  return useMemo(
    () => ({
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
    }),
    [
      adviceDialogOpen,
      advicePending,
      adviceRequestMode,
      applyAdviceSuggestion,
      confirmSendMessage,
      connectionState,
      dismissAdvice,
      draft,
      errorMessage,
      messages,
      nickname,
      pendingAdvice,
      requestInterventionAdvice,
      retry,
      sendMessage,
    ],
  );
}
