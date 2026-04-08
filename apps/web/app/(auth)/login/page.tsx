import Link from "next/link";
import { ArrowUpRight, GraduationCap, ShieldCheck } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@modus/classroom-ui";

const studentAppUrl = process.env.NEXT_PUBLIC_STUDENT_APP_URL ?? "http://localhost:3001";
const teacherAppUrl = process.env.NEXT_PUBLIC_TEACHER_APP_URL ?? "http://localhost:3002";

export default function LoginPage() {
  return (
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(95,120,186,0.12)]">
      <CardHeader className="space-y-4">
        <Badge variant="secondary" className="w-fit">로컬 로그인</Badge>
        <div>
          <CardTitle className="text-3xl">로그인</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">web 앱은 인증 진입 허브 역할을 맡고, 실제 역할별 UI는 student/teacher 앱으로 이동해 확인합니다.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">수강생 로그인</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">student 앱으로 이동해 수업/모둠 흐름 확인</p>
          </div>
          <div className="rounded-[28px] border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">교강사 로그인</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">teacher 앱으로 이동해 운영/공지 흐름 확인</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="you@modus.ac.kr" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg">
            <Link href={studentAppUrl} target="_blank" rel="noreferrer">
              <GraduationCap className="size-4" />
              student 앱 열기
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={teacherAppUrl} target="_blank" rel="noreferrer">
              <ShieldCheck className="size-4" />
              teacher 앱 열기
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-3 rounded-[28px] border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">계정이 아직 없나요?</p>
            <p className="text-sm text-muted-foreground">이메일 인증과 닉네임 자동 생성 흐름을 먼저 확인해보세요.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/signup">
              회원가입
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
