import { withTeacherAuth } from "../../../../lib/api/route";
import { getMeSettings, type MeSettingsResponseData } from "../../../../lib/me/service";

export function GET() {
  return withTeacherAuth<MeSettingsResponseData>(
    ({ accessToken }) => getMeSettings(accessToken),
    {
      mapData: (data) => ({ settings: data }),
    },
  );
}
