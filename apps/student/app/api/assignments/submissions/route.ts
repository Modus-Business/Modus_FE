import { withStudentAuthJson } from "../../../../lib/api/route";
import {
  submitAssignment,
  type AssignmentSubmissionItemData,
  type SubmitAssignmentRequest,
} from "../../../../lib/assignments/service";

export function POST(request: Request) {
  return withStudentAuthJson<SubmitAssignmentRequest, AssignmentSubmissionItemData>(
    request,
    ({ accessToken, body }) => submitAssignment(accessToken, body),
    {
      mapData: (data) => ({ submission: data }),
    },
  );
}
