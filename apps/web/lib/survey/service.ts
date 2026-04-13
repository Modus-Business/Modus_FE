import "server-only";

import {
  backendAuthClient,
  getErrorMessage,
  type BackendEnvelope,
  type BackendFailure,
  type BackendSuccess,
} from "../auth/server-client";

export type SubmitSurveyRequest = {
  mbti: string;
  personality: string;
  preference: string;
};

export type SurveyResponseData = {
  surveyId: string;
  userId: string;
  mbti: string | null;
  personality: string | null;
  preference: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function submitSurvey(
  accessToken: string,
  body: SubmitSurveyRequest,
): Promise<BackendSuccess<SurveyResponseData> | BackendFailure> {
  try {
    const response = await backendAuthClient.post<BackendEnvelope<SurveyResponseData>>("/survey", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const payload = response.data || null;

    if (response.status < 200 || response.status >= 300 || !payload?.data) {
      return {
        ok: false,
        status: response.status,
        message: getErrorMessage(payload, "학생 설문 저장에 실패했습니다."),
        payload,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: payload.data,
      payload,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: "설문 서버에 연결하지 못했습니다.",
      payload: null,
    };
  }
}
