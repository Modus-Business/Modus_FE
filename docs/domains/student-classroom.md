# Student Classroom Domain

## 목적

`apps/student`는 수강생이 수업 목록을 보고, 배정된 모둠 안에서 협업 흐름을 확인하는 클래스룸 앱입니다.

## 현재 책임

- 참여 중인 수업 목록 제공
- 수업 상세 진입
- 모둠 배정 여부에 따른 화면 분기
- 모둠 채팅과 팀원 목록 표시
- 학생 계정 정보/인증 상태 표시

## 관련 파일

- [`apps/student/app/page.tsx`](/Users/minsu/Documents/modus-fe/apps/student/app/page.tsx)
- [`apps/student/app/classes/page.tsx`](/Users/minsu/Documents/modus-fe/apps/student/app/classes/page.tsx)
- [`apps/student/app/class/[classId]/page.tsx`](/Users/minsu/Documents/modus-fe/apps/student/app/class/[classId]/page.tsx)
- [`apps/student/app/class/[classId]/group-members-card.tsx`](/Users/minsu/Documents/modus-fe/apps/student/app/class/[classId]/group-members-card.tsx)
- [`apps/student/app/settings/page.tsx`](/Users/minsu/Documents/modus-fe/apps/student/app/settings/page.tsx)

## 도메인 모듈 관점

### Class list

- 수강 중인 수업 카드 목록을 보여줍니다.
- 카드 정보는 공통 패키지의 `studentClassrooms`를 소비합니다.

### Class detail

- 모둠이 있으면 채팅 + 팀원 목록을 보여줍니다.
- 모둠이 없으면 빈 상태를 보여줍니다.
- 즉, 학생 상세 도메인의 핵심 분기 조건은 `group` 존재 여부입니다.

### Settings

- 학생 본명/인증 상태를 요약해서 보여줍니다.
- 개인정보 노출 정책을 UI 문구 수준에서 설명합니다.

## 의존 모듈

- [`packages/classroom-ui/src/dashboard/chat/group-chat.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/chat/group-chat.tsx)
- [`packages/classroom-ui/src/dashboard/feedback/empty-state.tsx`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/dashboard/feedback/empty-state.tsx)
- [`packages/classroom-ui/src/lib/mock-data.ts`](/Users/minsu/Documents/modus-fe/packages/classroom-ui/src/lib/mock-data.ts)

## 해석

이 도메인은 "학습 관리" 전체보다 "학생이 실제로 체감하는 수업 참여 화면"에 집중된 모듈입니다.
