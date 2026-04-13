import type { ChatAdviceResult } from "./types";

function getFirstString(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const match = value.find((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
    return match || "";
  }

  return "";
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

export function normalizeChatAdvicePayload(payload: unknown, status: number, options?: { forceBlocked?: boolean }) {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const inferredBlocked =
    typeof data.blocked === "boolean"
      ? data.blocked
      : typeof data.isBlocked === "boolean"
        ? data.isBlocked
        : typeof data.allowed === "boolean"
          ? !data.allowed
          : typeof data.canSend === "boolean"
            ? !data.canSend
            : status === 400 || status === 403;

  const blocked = options?.forceBlocked === false ? false : inferredBlocked;

  const message =
    getFirstString(data.message)
    || getFirstString(data.advice)
    || getFirstString(data.warning)
    || getFirstString(data.reason)
    || (blocked ? "메시지를 보내기 전에 내용을 수정해 주세요." : "메시지를 보내기 전에 한 번 확인해 주세요.");

  const suggestion =
    getFirstString(data.suggestion)
    || getFirstString(data.recommendedText)
    || getFirstString(data.recommendation)
    || getFirstString(data.revisedMessage)
    || undefined;

  const warnings =
    getStringArray(data.warnings).length > 0
      ? getStringArray(data.warnings)
      : getStringArray(data.warningMessages).length > 0
        ? getStringArray(data.warningMessages)
        : message
          ? [message]
          : [];

  const riskLabel =
    getFirstString(data.riskLabel)
    || getFirstString(data.severityLabel)
    || getFirstString(data.riskLevel)
    || undefined;

  const result: ChatAdviceResult = {
    blocked,
    message,
    suggestion,
    warnings,
  };

  if (riskLabel) {
    result.riskLabel = riskLabel;
  }

  return result;
}

export function normalizeMessageAdvicePayload(payload: unknown, status: number) {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const blocked =
    typeof data.shouldBlock === "boolean"
      ? data.shouldBlock
      : typeof data.blocked === "boolean"
        ? data.blocked
        : status === 400 || status === 403;

  const warning =
    getFirstString(data.warning)
    || getFirstString(data.message)
    || "";

  const suggestion =
    getFirstString(data.suggestedRewrite)
    || getFirstString(data.suggestion)
    || undefined;

  const rawRiskLevel =
    getFirstString(data.riskLevel).toLowerCase()
    || getFirstString(data.riskLabel).toLowerCase();

  const riskLabel = rawRiskLevel === "high"
    ? "위험도 높음"
    : rawRiskLevel === "medium"
      ? "위험도 보통"
      : rawRiskLevel === "low"
        ? "위험도 낮음"
        : undefined;

  const message = blocked
    ? "이 문장은 바로 전송되지 않아요. 수정안을 적용하거나 다듬고 다시 작성해 주세요."
    : warning || "메시지 내용을 한 번 더 확인해 주세요.";

  const warnings = warning ? [warning] : [];

  const result: ChatAdviceResult = {
    blocked,
    message,
    suggestion,
    warnings,
  };

  if (riskLabel) {
    result.riskLabel = riskLabel;
  }

  return result;
}

export function normalizeInterventionAdvicePayload(payload: unknown) {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const message =
    getFirstString(data.reason)
    || getFirstString(data.message)
    || "현재 대화 맥락을 바탕으로 개입 조언을 준비했어요.";

  const suggestion =
    getFirstString(data.suggestedMessage)
    || getFirstString(data.suggestion)
    || undefined;

  const interventionType = getFirstString(data.interventionType);
  const riskLabel =
    typeof data.interventionNeeded === "boolean"
      ? data.interventionNeeded
        ? "개입 필요"
        : "개입 선택"
      : interventionType || undefined;

  const warnings = message ? [message] : [];

  const result: ChatAdviceResult = {
    blocked: false,
    message,
    suggestion,
    warnings,
  };

  if (riskLabel) {
    result.riskLabel = riskLabel;
  }

  return result;
}
