import type { ReactNode } from "react";
import Link from "next/link";

import { BrandLogo } from "@modus/classroom-ui";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(91,132,255,0.18),_transparent_35%),linear-gradient(180deg,#f8faff_0%,#eef4ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[34px] border border-white/60 bg-white/80 shadow-[0_35px_120px_rgba(95,120,186,0.16)] backdrop-blur lg:grid lg:grid-cols-[1.02fr_minmax(0,0.98fr)]">
        <section className="relative flex flex-col justify-between gap-10 bg-linear-to-br from-primary via-[#7da1ff] to-[#c8d8ff] px-6 py-8 text-white sm:px-10 sm:py-12">
          <div className="space-y-6">
            <Link href="/login" className="inline-flex items-center" aria-label="Modus 로그인으로 이동">
              <BrandLogo size="auth" className="brightness-0 invert" />
            </Link>
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/75">Monorepo Entry</p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">학생/교강사 앱을 분리한 클래스룸형 워크스페이스</h1>
              <p className="max-w-lg text-base leading-7 text-white/82">web 앱은 로그인/회원가입과 진입 허브를 담당하고, student/teacher 앱은 역할별 대시보드 경험을 독립적으로 제공합니다.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/16 bg-white/12 p-5 backdrop-blur">
              <p className="text-sm font-medium text-white/70">apps/student</p>
              <h2 className="mt-2 text-2xl font-semibold">수업 참여 · 모둠 작업</h2>
              <p className="mt-3 text-sm leading-6 text-white/78">참여한 수업, 모둠 채팅, 과제 제출, 공지 확인 흐름을 담당합니다.</p>
            </div>
            <div className="rounded-[28px] border border-white/16 bg-white/12 p-5 backdrop-blur">
              <p className="text-sm font-medium text-white/70">apps/teacher</p>
              <h2 className="mt-2 text-2xl font-semibold">수업 생성 · 운영 관리</h2>
              <p className="mt-3 text-sm leading-6 text-white/78">생성한 클래스와 수업 코드, 공지 작성, 모둠 제출 현황을 관리합니다.</p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </div>
  );
}
