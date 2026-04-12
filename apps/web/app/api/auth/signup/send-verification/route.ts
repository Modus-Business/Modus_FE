import { withJsonBody } from "../../../../../lib/api/route";
import { sendSignupVerification, type SendSignupVerificationRequest } from "../../../../../lib/auth/service";
import type { SendSignupVerificationResponseData } from "../../../../../lib/auth/service";

export function POST(request: Request) {
  return withJsonBody<SendSignupVerificationRequest, SendSignupVerificationResponseData>(
    request,
    sendSignupVerification,
  );
}
