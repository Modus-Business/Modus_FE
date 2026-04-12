import { withStudentAuth } from "../../../../lib/api/route";
import { getMeSettings, type MeSettingsResponseData } from "../../../../lib/me/service";

export function GET() {
  return withStudentAuth<MeSettingsResponseData>(
    ({ accessToken }) => getMeSettings(accessToken),
    {
      mapData: (data) => ({ settings: data }),
    },
  );
}
