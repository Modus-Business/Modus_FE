import { withStudentAuthJson } from "../../../../lib/api/route";
import {
  createPresignedUploadUrl,
  type CreatePresignedUploadUrlRequest,
  type CreatePresignedUploadUrlResponseData,
} from "../../../../lib/storage/service";

export function POST(request: Request) {
  return withStudentAuthJson<CreatePresignedUploadUrlRequest, CreatePresignedUploadUrlResponseData>(
    request,
    ({ accessToken, body }) => createPresignedUploadUrl(accessToken, body),
    {
      mapData: (data) => ({ upload: data }),
    },
  );
}
