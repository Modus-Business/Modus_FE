import { withStudentAuth } from "../../../lib/api/route";
import {
  getClasses,
  type ClassesResponseData,
} from "../../../lib/classes/service";

export function GET() {
  return withStudentAuth<ClassesResponseData>(
    ({ accessToken }) => getClasses(accessToken),
  );
}
