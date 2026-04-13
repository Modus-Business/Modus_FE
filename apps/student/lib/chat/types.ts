export type ChatJoinRequest = {
  groupId: string;
};

export type ChatSendRequest = {
  content: string;
};

export type ChatMessageAdviceRequest = {
  groupId: string;
  content: string;
};

export type ChatInterventionAdviceRequest = {
  groupId: string;
};

export type ChatAdviceResult = {
  blocked: boolean;
  message: string;
  suggestion?: string;
  warnings: string[];
  riskLabel?: string;
};

export type ChatMessageAdviceResult = ChatAdviceResult;

export type ChatJoinedEvent = {
  groupId: string;
  nickname: string;
  joinedAt: string;
};

export type ChatMessage = {
  messageId: string;
  groupId: string;
  nickname: string;
  content: string;
  sentAt: string;
};

export type ChatErrorEvent = {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  event?: string;
};

export type ChatConnectionState = "idle" | "connecting" | "joined" | "error";

export type ChatTokenResponse = {
  token: string;
};
