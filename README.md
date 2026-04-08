# Modus FE Monorepo

pnpm + Turborepo 기반 모노레포입니다.

## Apps

- `apps/web`: 로그인 / 회원가입 허브
- `apps/student`: 수강생 앱
- `apps/teacher`: 교강사 앱

## Shared package

- `packages/classroom-ui`: shadcn/ui 스타일 공통 UI, 레이아웃, 목업 데이터

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
pnpm dev:web
pnpm dev:student
pnpm dev:teacher
```

기본 포트:

- web: `3000`
- student: `3001`
- teacher: `3002`

## Verify

```bash
pnpm lint
pnpm build
```

## Deploy

Vercel에서 같은 저장소를 3개 프로젝트로 연결하고 각 Root Directory를 아래처럼 지정하면 됩니다.

- `apps/web`
- `apps/student`
- `apps/teacher`
