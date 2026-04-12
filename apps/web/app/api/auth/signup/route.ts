import { withJsonBody } from "../../../../lib/api/route";
import { signup, type SignupRequest, type SignupResponseData } from "../../../../lib/auth/service";

export function POST(request: Request) {
  return withJsonBody<SignupRequest, SignupResponseData>(request, signup, {
    mapData: (data) => ({
      signedUp: true,
      email: data.email,
    }),
  });
}
