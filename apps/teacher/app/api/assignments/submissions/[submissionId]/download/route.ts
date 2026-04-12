import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "../../../../../../lib/api/route";
import { fetchSubmissionFile } from "../../../../../../lib/assignments/service";

type SubmissionDownloadRouteContext = {
  params: Promise<{
    submissionId: string;
  }>;
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function sanitizeFileNamePart(value: string, fallback: string) {
  const normalized = value.trim().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ");
  return normalized || fallback;
}

function getFileNameFromDisposition(contentDisposition: string) {
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match && utf8Match[1]) {
    return safeDecode(utf8Match[1].trim());
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);

  if (quotedMatch && quotedMatch[1]) {
    return quotedMatch[1].trim();
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i);

  if (plainMatch && plainMatch[1]) {
    return plainMatch[1].trim();
  }

  return "";
}

function getExtensionFromContentType(contentType: string) {
  const normalized = contentType.split(";")[0]?.trim().toLowerCase() || "";
  const extensionByType: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/zip": ".zip",
    "application/x-zip-compressed": ".zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-excel": ".xls",
    "text/plain": ".txt",
  };

  return extensionByType[normalized] || "";
}

function getExtension(fileName: string, contentType: string) {
  const normalizedName = fileName.split("?")[0].split("#")[0];
  const extensionMatch = normalizedName.match(/(\.[a-z0-9]+)$/i);

  if (extensionMatch && extensionMatch[1]) {
    return extensionMatch[1].toLowerCase();
  }

  return getExtensionFromContentType(contentType);
}

function buildAttachmentDisposition(
  contentDisposition: string,
  className: string,
  groupName: string,
  contentType: string,
) {
  const originalFileName = getFileNameFromDisposition(contentDisposition);
  const extension = getExtension(originalFileName, contentType);
  const baseName = [
    sanitizeFileNamePart(className, "수업"),
    sanitizeFileNamePart(groupName, "모둠"),
    "과제",
  ].join("_");
  const downloadName = `${baseName}${extension}`;
  const asciiFallback = `submission${extension}`;

  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`;
}

export async function GET(request: Request, context: SubmissionDownloadRouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const { submissionId } = await context.params;
  const { searchParams } = new URL(request.url);
  const className = searchParams.get("className") || "";
  const groupName = searchParams.get("groupName") || "";

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!submissionId) {
    return NextResponse.json({ message: "제출 ID가 필요합니다." }, { status: 400 });
  }

  const result = await fetchSubmissionFile(accessToken, submissionId);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const headers = new Headers();

  if (result.data.contentType) {
    headers.set("Content-Type", result.data.contentType);
  }

  headers.set(
    "Content-Disposition",
    buildAttachmentDisposition(
      result.data.contentDisposition,
      className,
      groupName,
      result.data.contentType,
    ),
  );

  if (result.data.contentLength) {
    headers.set("Content-Length", result.data.contentLength);
  }

  return new Response(result.data.body, {
    status: result.status,
    headers,
  });
}
