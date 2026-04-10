# Auth Hub Domain

## 목적

`apps/web`는 Modus 서비스의 로그인/회원가입 허브입니다.

학생/교강사 앱으로 들어가기 전 공통 인증 진입점을 제공하는 역할을 맡습니다.

## 현재 책임

- `/auth` 단일 화면 제공
- 로그인/회원가입 상태 전환
- `/login`, `/signup` 레거시/보조 진입점을 `/auth` 기반 흐름으로 정리

## 관련 파일

- [`apps/web/app/page.tsx`](/Users/minsu/Documents/modus-fe/apps/web/app/page.tsx)
- [`apps/web/app/(auth)/auth/page.tsx`](/Users/minsu/Documents/modus-fe/apps/web/app/(auth)/auth/page.tsx)
- [`apps/web/app/(auth)/auth/auth-screen.tsx`](/Users/minsu/Documents/modus-fe/apps/web/app/(auth)/auth/auth-screen.tsx)
- [`apps/web/app/(auth)/login/page.tsx`](/Users/minsu/Documents/modus-fe/apps/web/app/(auth)/login/page.tsx)
- [`apps/web/app/(auth)/signup/page.tsx`](/Users/minsu/Documents/modus-fe/apps/web/app/(auth)/signup/page.tsx)

## 도메인 모듈 관점

### Entry routes

- `/`는 `/auth`로 보냅니다.
- `/login`은 `/auth`로 보냅니다.
- `/signup`은 `/auth#signup`으로 보냅니다.

### Auth screen

- 실질적인 인증 UI는 `auth-screen.tsx`에 집중되어 있습니다.
- 현재는 화면 상태와 UX 흐름 정리가 중심이며, 외부 인증 API 연동 코드는 아직 없습니다.

## 해석

이 도메인은 "인증 처리 백엔드"보다 "인증 진입 UX"를 담당하는 프런트엔드 허브 모듈입니다.
