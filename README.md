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

## CI / CD

CI는 GitHub Actions에서 `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`를 실행합니다.

CD는 Vercel에서 같은 저장소를 3개 프로젝트로 분리해 연결하는 방식입니다.

각 프로젝트의 Root Directory:

- `apps/web`
- `apps/student`
- `apps/teacher`

권장 프로젝트 이름:

- `modus`
- `modus-student`
- `modus-teacher`

권장 설정:

- Framework Preset: `Next.js`
- Build Command:
  - web: `cd ../.. && turbo run build --filter=@modus/web`
  - student: `cd ../.. && turbo run build --filter=@modus/student`
  - teacher: `cd ../.. && turbo run build --filter=@modus/teacher`
- Output Directory: `Next.js default`

주의:

- `Output Directory`에 build command 문자열을 넣으면 배포가 실패합니다.
- 예전 legacy Vercel 프로젝트 이름(`modus-fe-teacher` 같은 변형)은 다시 연결하지 않는 편이 안전합니다.
