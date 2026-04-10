# Shared Classroom UI Domain

## 목적

`packages/classroom-ui`는 세 앱이 공통으로 사용하는 UI, 레이아웃, 도메인 컴포넌트, 목업 데이터를 담는 공유 패키지입니다.

현재 이 저장소의 실질적인 중심 모듈입니다.

## 현재 책임

- 공통 primitive UI 제공
- 학생/교강사 공통 레이아웃 제공
- 수업 카드, 공지 dialog, 채팅, 팀 배치 등 도메인 컴포넌트 제공
- 목업 데이터와 조회 함수 제공

## 내부 모듈 구분

### `src/ui`

- 버튼, 입력창, 배지, 카드, 다이얼로그 같은 기본 UI 레이어

### `src/dashboard/layout`

- `AppShell`
- `SidebarNav`
- `TopHeader`

학생/교강사 앱이 공통으로 쓰는 프레임 구조입니다.

### `src/dashboard/dialogs`

- 수업 참여
- 수업 만들기
- 공지 조회/편집
- 과제 제출

화면 상단 액션의 상당수가 여기 모여 있습니다.

### `src/dashboard/chat`

- 학생 상세 화면의 그룹 채팅 UI

### `src/dashboard/teacher`

- 모둠 배치 보드

### `src/lib/mock-data.ts`

- 프로필
- 공지
- 과제
- 학생 수업
- 교강사 수업
- 모둠/팀 데이터

현재 도메인 상태를 만드는 단일 fixture 레이어입니다.

## 관련 파일

- [`packages/classroom-ui/src/index.ts`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/index.ts)
- [`packages/classroom-ui/src/lib/mock-data.ts`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/lib/mock-data.ts)
- [`packages/classroom-ui/src/dashboard/layout/app-shell.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/layout/app-shell.tsx)
- [`packages/classroom-ui/src/dashboard/dialogs/dialog-triggers.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/dialogs/dialog-triggers.tsx)
- [`packages/classroom-ui/src/dashboard/chat/group-chat.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/chat/group-chat.tsx)
- [`packages/classroom-ui/src/dashboard/teacher/team-arrangement-board.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/teacher/team-arrangement-board.tsx)

## 구조적 해석

- 장점: 앱이 얇고, 공통 UI/도메인 흐름을 빠르게 재사용할 수 있습니다.
- 단점: UI와 fixture 데이터가 같은 패키지에 있어 장기적으로는 경계가 다소 두껍습니다.

즉, 지금은 개발 속도에 최적화된 공유 패키지 구조이고, 실제 API 연동이 시작되면 패키지 책임을 다시 나눌 가능성이 큽니다.
