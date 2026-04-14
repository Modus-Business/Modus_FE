# Modus FE Monorepo

Modus의 인증 허브, 수강생 클래스룸, 교강사 클래스룸을 함께 관리하는 `pnpm + Turborepo` 기반 프런트엔드 모노레포입니다.

현재 저장소는 `@modus/classroom-ui`의 공통 UI/목업 데이터를 각 앱이 소비하는 구조로 되어 있으며, 아직 API 연동보다 화면 흐름과 역할별 UX 정리에 무게가 실린 프런트엔드 프로토타입 성격이 강합니다.

https://modus-theta.vercel.app/auth

## 프로젝트 성격

- `apps/web`: 로그인/회원가입 허브
- `apps/student`: 수강생용 클래스룸
- `apps/teacher`: 교강사용 클래스룸 운영 화면
- `packages/classroom-ui`: 공통 UI 컴포넌트, 레이아웃, 다이얼로그, 목업 데이터

도메인 설명은 [docs/README.md](/Users/minsu/Documents/modus-fe/docs/README.md)부터 보면 됩니다.

## 모노레포 구조

```text
.
├─ apps/
│  ├─ web/        # 인증 허브
│  ├─ student/    # 수강생 앱
│  └─ teacher/    # 교강사 앱
├─ packages/
│  └─ classroom-ui/ # 공통 UI/레이아웃/목업 데이터
├─ docs/          # 프로젝트/도메인 문서
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

## 앱별 책임

### `apps/web`

- `/`에서 `/auth`로 이동
- `/auth`에서 로그인/회원가입 단일 화면 제공
- `/signup`은 `/auth#signup`으로 리다이렉트

### `apps/student`

- `/`에서 `/classes`로 이동
- 수강 중인 수업 목록 제공
- 수업 상세에서 모둠 채팅과 팀원 목록 제공
- 설정 화면에서 학생 프로필/인증 상태 노출

### `apps/teacher`

- `/`에서 `/classes`로 이동
- 생성한 수업 목록과 수업 생성 다이얼로그 제공
- 수업 상세에서 공지 관리와 모둠 현황 확인
- 모둠 배치 화면에서 학생을 팀에 배정
- 설정 화면에서 교강사 정보와 공지 기본값 노출

### `packages/classroom-ui`

- 공통 UI: button, dialog, input, badge, card 등
- 공통 레이아웃: `AppShell`, `SidebarNav`, `TopHeader`, `PageHeader`
- 도메인 UI: `ClassCard`, `GroupChat`, `TeamArrangementBoard`, 각종 dialog
- 공통 데이터: `studentProfile`, `teacherProfile`, 클래스/공지/과제/모둠 목업 데이터

## 현재 아키텍처 포인트

- 세 앱 모두 Next.js App Router 기반입니다.
- 학생/교강사 앱은 공통 `AppShell`을 사용하고 `role`만 다르게 주입합니다.
- 실제 API 호출 계층은 아직 없고, `packages/classroom-ui/src/lib/mock-data.ts`가 도메인 데이터 소스 역할을 합니다.
- 즉, 지금 단계의 핵심은 역할별 화면 구조와 공통 컴포넌트 재사용성입니다.

## 문서 맵

- [docs/README.md](/Users/minsu/Documents/modus-fe/docs/README.md): 문서 인덱스
- [docs/project-overview.md](/Users/minsu/Documents/modus-fe/docs/project-overview.md): 프로젝트 개요/구조/라우팅
- [docs/domains/auth-hub.md](/Users/minsu/Documents/modus-fe/docs/domains/auth-hub.md): 인증 허브 도메인
- [docs/domains/student-classroom.md](/Users/minsu/Documents/modus-fe/docs/domains/student-classroom.md): 수강생 도메인
- [docs/domains/teacher-classroom.md](/Users/minsu/Documents/modus-fe/docs/domains/teacher-classroom.md): 교강사 도메인
- [docs/domains/shared-classroom-ui.md](/Users/minsu/Documents/modus-fe/docs/domains/shared-classroom-ui.md): 공통 UI/모듈 도메인

## 설치와 실행

```bash
pnpm install
pnpm dev
```

개별 실행:

```bash
pnpm dev:web
pnpm dev:student
pnpm dev:teacher
```

기본 포트:

- web: `3000`
- student: `3001`
- teacher: `3002`

## 검증

```bash
pnpm lint
pnpm build
```

## 배포 메모

Vercel에서 앱별로 별도 프로젝트를 연결하는 방식이 적합합니다.

- `apps/web`
- `apps/student`
- `apps/teacher`

권장 프로젝트 이름:

- `modus`
- `modus-student`
- `modus-teacher`

권장 Build Command:

- web: `cd ../.. && turbo run build --filter=@modus/web`
- student: `cd ../.. && turbo run build --filter=@modus/student`
- teacher: `cd ../.. && turbo run build --filter=@modus/teacher`

주의:

- `Output Directory`에는 build command가 아니라 Next.js 기본 출력 설정을 사용해야 합니다.
- 기존 legacy 프로젝트 이름이 있더라도 새 연결 시에는 재사용보다 현재 앱 구조 기준으로 다시 정리하는 편이 안전합니다.
- `modus`, `modus-student`, `modus-teacher`처럼 분리 배포하면 브라우저는 각 앱의 `/api/*` BFF를 먼저 호출하고, BFF가 서버에서 `API_BASE_URL`로 백엔드를 프록시합니다.
- Vercel 기본 `*.vercel.app` 도메인에서는 프로젝트 간 쿠키 공유를 가정하지 말고, `AUTH_COOKIE_DOMAIN`이 없는 환경에서는 `AUTH_HANDOFF_SECRET` 기반 로그인 handoff를 함께 설정해야 합니다.

## 인증 환경변수

- `API_BASE_URL`: 서버/BFF가 프록시할 백엔드 base URL. 권장 표준 키입니다.
- `NEXT_PUBLIC_API_BASE_URL`: 클라이언트/서버 공용 fallback 키.
- `NEXT_PUBLIC_API_BASEURL`: 기존 legacy fallback 키. 운영에서는 새 키로 전환하는 편이 안전합니다.
- `NEXT_PUBLIC_WEB`: auth hub 주소
- `NEXT_PUBLIC_STUDENT`: student 앱 주소
- `NEXT_PUBLIC_TEACHER`: teacher 앱 주소
- `AUTH_COOKIE_DOMAIN`: 커스텀 상위 도메인에서 shared cookie를 쓸 때만 설정
- `AUTH_HANDOFF_SECRET`: host-only 쿠키 환경에서 web -> student/teacher 로그인 handoff를 암호화할 때 사용하는 공통 비밀값
