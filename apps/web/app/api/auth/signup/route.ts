import { NextResponse } from "next/server";

import { getAccessToken } from "../../../../lib/api/route";
import { clearAuthCookies, getSessionFromAccessToken, setAuthCookies } from "../../../../lib/auth";
import {
  login,
  signup,
  type LoginResponseData,
  type SignupRequest,
} from "../../../../lib/auth/service";
import { getMySurvey, submitSurvey, type SubmitSurveyRequest, type SurveyResponseData } from "../../../../lib/survey/service";

type SignupRouteRequest = SignupRequest & SubmitSurveyRequest;

type SignupRouteSuccessBody = {
  signedUp: true;
  email: string;
  authenticated?: boolean;
  user?: {
    email: string;
    role: "student" | "teacher";
  };
  surveySubmitted?: boolean;
  surveyMessage?: string;
  survey?: SurveyResponseData | null;
};

function buildSignupBody(body: SignupRouteRequest): SignupRequest {
  return {
    name: body.name.trim(),
    email: body.email.trim(),
    verificationCode: body.verificationCode.trim(),
    role: body.role,
    password: body.password,
    passwordConfirmation: body.passwordConfirmation,
  };
}

function buildSurveyBody(body: SignupRouteRequest): SubmitSurveyRequest {
  return {
    mbti: body.mbti.trim(),
    personality: body.personality.trim(),
    preference: body.preference.trim(),
  };
}

function createStudentResponse(body: SignupRouteSuccessBody, loginResult: LoginResponseData) {
  const response = NextResponse.json(body);
  setAuthCookies(response, loginResult);
  return response;
}

function createSignedUpResponse(body: SignupRouteSuccessBody) {
  const response = NextResponse.json(body);
  clearAuthCookies(response);
  return response;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SignupRouteRequest | null;

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const signupBody = buildSignupBody(body);

  if (signupBody.role === "teacher") {
    const signupResult = await signup(signupBody);

    if (!signupResult.ok) {
      return NextResponse.json({ message: signupResult.message }, { status: signupResult.status });
    }

    return NextResponse.json(
      {
        signedUp: true,
        email: signupResult.data.email,
      } satisfies SignupRouteSuccessBody,
      { status: signupResult.status },
    );
  }

  const currentAccessToken = await getAccessToken();
  const currentSession = getSessionFromAccessToken(currentAccessToken);

  if (
    currentSession.authenticated &&
    currentSession.user.role === "student" &&
    currentSession.user.email.toLowerCase() === signupBody.email.toLowerCase()
  ) {
    const surveyResult = await submitSurvey(currentAccessToken, buildSurveyBody(body));

    if (surveyResult.ok) {
      const surveyDetailResult = await getMySurvey(currentAccessToken);
      return createSignedUpResponse({
        signedUp: true,
        email: signupBody.email,
        surveySubmitted: true,
        survey: surveyDetailResult.ok ? surveyDetailResult.data : surveyResult.data,
      });
    }

    return NextResponse.json({
      signedUp: true,
      email: signupBody.email,
      authenticated: true,
      user: currentSession.user,
      surveySubmitted: false,
      surveyMessage: surveyResult.message,
    } satisfies SignupRouteSuccessBody);
  }

  const signupResult = await signup(signupBody);

  if (!signupResult.ok) {
    return NextResponse.json({ message: signupResult.message }, { status: signupResult.status });
  }

  const loginResult = await login({
    email: signupBody.email,
    password: signupBody.password,
  });

  if (!loginResult.ok) {
    return NextResponse.json(
      {
        message: "회원가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 후 다시 진행해 주세요.",
      },
      { status: 502 },
    );
  }

  const session = getSessionFromAccessToken(loginResult.data.accessToken);

  if (!session.authenticated || session.user.role !== "student") {
    return NextResponse.json({ message: "로그인 응답을 해석하지 못했습니다." }, { status: 502 });
  }

  const surveyResult = await submitSurvey(loginResult.data.accessToken, buildSurveyBody(body));

  if (surveyResult.ok) {
    const surveyDetailResult = await getMySurvey(loginResult.data.accessToken);
    return createSignedUpResponse({
      signedUp: true,
      email: signupBody.email,
      surveySubmitted: true,
      survey: surveyDetailResult.ok ? surveyDetailResult.data : surveyResult.data,
    });
  }

  return createStudentResponse(
    {
      signedUp: true,
      email: signupBody.email,
      authenticated: true,
      user: session.user,
      surveySubmitted: false,
      surveyMessage: surveyResult.message,
    },
    loginResult.data,
  );
}
