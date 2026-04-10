# Project Overview

## 한 줄 설명

Modus FE는 인증 허브와 역할별 클래스룸 화면을 하나의 모노레포로 관리하는 Next.js 기반 프런트엔드 프로젝트입니다.

## 현재 구조

- `apps/web`: 인증 진입점
- `apps/student`: 수강생 경험
- `apps/teacher`: 교강사 운영 경험
- `packages/classroom-ui`: 공통 UI, 레이아웃, 도메인 컴포넌트, 목업 데이터

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- pnpm workspace
- Turborepo

## 라우팅 요약

### Web

- `/` -> `/auth`
- `/login` -> `/auth`
- `/signup` -> `/auth#signup`
- `/auth` -> 인증 단일 화면

### Student

- `/` -> `/classes`
- `/classes` -> 수강 중인 수업 목록
- `/class/[classId]` -> 모둠 채팅/팀원 화면 또는 빈 상태
- `/settings` -> 프로필/인증 상태

### Teacher

- `/` -> `/classes`
- `/classes` -> 수업 목록/수업 생성
- `/class/[classId]` -> 수업 상세/공지/모둠 현황
- `/class/[classId]/groups` -> 모둠 배치 보드
- `/settings` -> 교강사 정보/공지 기본값

## 데이터 흐름

현재 저장소에는 별도 API 계층이 없습니다.

- 앱 페이지는 `@modus/classroom-ui`에서 컴포넌트와 데이터를 함께 가져옵니다.
- 도메인 데이터는 [`packages/classroom-ui/src/lib/mock-data.ts`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/lib/mock-data.ts)에 집중되어 있습니다.
- 즉, 지금은 서버 연동보다 역할별 UX와 공통 컴포넌트 구조를 빠르게 검증하는 단계입니다.

## 설계 포인트

- 학생/교강사 앱은 같은 `AppShell`을 재사용하고 `role`로 분기합니다.
- 상세 페이지별 액션은 `TopHeader`, `SidebarNav`, dialog 조합으로 얹는 구조입니다.
- 수업, 공지, 채팅, 팀 배치 같은 업무 UI는 공통 패키지 안에 모여 있어 앱은 얇은 엔트리 포인트 역할을 합니다.

## 이후 문서화/개발 포인트

- API 계층이 도입되면 `mock-data.ts` 의존도를 줄이고 app/domain/service 경계를 다시 문서화해야 합니다.
- 현재는 `classroom-ui`가 UI와 도메인 데이터를 함께 가진 상태라, 장기적으로는 `shared-ui`와 `shared-domain-fixtures`를 분리할 여지가 있습니다.
