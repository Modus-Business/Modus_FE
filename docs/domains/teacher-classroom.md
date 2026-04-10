# Teacher Classroom Domain

## 목적

`apps/teacher`는 교강사가 수업을 만들고, 공지를 관리하고, 학생을 모둠에 배치하는 운영용 클래스룸 앱입니다.

## 현재 책임

- 수업 목록 조회
- 수업 생성 다이얼로그 제공
- 수업 상세에서 공지/수업 코드/모둠 현황 관리
- 모둠 배치 보드 제공
- 교강사 계정/공지 기본값 표시

## 관련 파일

- [`apps/teacher/app/page.tsx`](/Users/minsu/Documents/modus-fe/apps/teacher/app/page.tsx)
- [`apps/teacher/app/classes/page.tsx`](/Users/minsu/Documents/modus-fe/apps/teacher/app/classes/page.tsx)
- [`apps/teacher/app/class/[classId]/page.tsx`](/Users/minsu/Documents/modus-fe/apps/teacher/app/class/[classId]/page.tsx)
- [`apps/teacher/app/class/[classId]/groups/page.tsx`](/Users/minsu/Documents/modus-fe/apps/teacher/app/class/[classId]/groups/page.tsx)
- [`apps/teacher/app/settings/page.tsx`](/Users/minsu/Documents/modus-fe/apps/teacher/app/settings/page.tsx)

## 도메인 모듈 관점

### Classes

- 수업 카드 목록과 새 수업 생성 액션을 제공합니다.
- 교강사 입장에서 전체 수업 운영의 시작점입니다.

### Class detail

- 수업명/설명/수업 코드/공지 액션을 상단에서 처리합니다.
- 본문은 모둠 요약 카드 영역입니다.
- 현재는 각 모둠의 이름, 제출 여부, 구성원 수를 보여주는 쪽으로 단순화되어 있습니다.

### Group arrangement

- `TeamArrangementBoard`를 통해 학생을 팀으로 배치합니다.
- 수업 상세보다 더 운영 중심적인 작업 화면입니다.

### Settings

- 교강사 실명, 이메일, 공지 노출 기본값을 보여줍니다.

## 의존 모듈

- [`packages/classroom-ui/src/dashboard/teacher/team-arrangement-board.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/teacher/team-arrangement-board.tsx)
- [`packages/classroom-ui/src/dashboard/dialogs/dialog-triggers.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/dialogs/dialog-triggers.tsx)
- [`packages/classroom-ui/src/lib/mock-data.ts`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/lib/mock-data.ts)

## 해석

이 도메인은 LMS 전체를 구현한 것이 아니라, 교강사의 수업 운영 핵심 플로우를 우선 정리한 운영 콘솔 모듈입니다.
