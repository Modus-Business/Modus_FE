import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "../../../../lib/api/route";
import {
  createPresignedUploadUrl,
  uploadFileToStorage,
  type CreatePresignedUploadUrlRequest,
} from "../../../../lib/storage/service";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const formData = await request.formData().catch(() => null);

  if (!accessToken) {
    return NextResponse.json({ message: "인증 토큰이 필요합니다." }, { status: 401 });
  }

  if (!formData) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const fileEntry = formData.get("file");
  const purposeEntry = formData.get("purpose");
  const purpose = typeof purposeEntry === "string" ? purposeEntry : "";

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ message: "업로드할 파일이 필요합니다." }, { status: 400 });
  }

  const presignedRequest: CreatePresignedUploadUrlRequest = {
    fileName: fileEntry.name,
    contentType: fileEntry.type || "application/octet-stream",
    purpose: purpose === "images" || purpose === "general" ? purpose : "assignments",
  };
  const presignedResult = await createPresignedUploadUrl(accessToken, presignedRequest);

  if (!presignedResult.ok) {
    return NextResponse.json({ message: presignedResult.message }, { status: presignedResult.status });
  }

  const uploadResult = await uploadFileToStorage(
    presignedResult.data.uploadUrl,
    await fileEntry.arrayBuffer(),
    presignedRequest.contentType,
  );

  if (!uploadResult.ok) {
    return NextResponse.json({ message: uploadResult.message }, { status: uploadResult.status });
  }

  return NextResponse.json({
    upload: {
      fileKey: presignedResult.data.fileKey,
      fileUrl: presignedResult.data.fileUrl,
    },
  });
}
