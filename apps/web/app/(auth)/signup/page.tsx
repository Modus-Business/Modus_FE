import Link from "next/link";
import { RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@modus/classroom-ui";

export default function SignupPage() {
  return (
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(95,120,186,0.12)]">
      <CardHeader className="space-y-4">
        <Badge variant="secondary" className="w-fit">로컬 회원가입</Badge>
        <div>
          <CardTitle className="text-3xl">회원가입</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">이메일 인증, 닉네임 자동 생성/중복 처리, 본명 공개 범위까지 고려한 허브 앱의 퍼블리싱 화면입니다.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="signup-email">이메일</Label>
            <Input id="signup-email" type="email" placeholder="you@modus.ac.kr" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-password">비밀번호</Label>
            <Input id="signup-password" type="password" placeholder="8자 이상 입력" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-nickname">닉네임</Label>
            <Input id="signup-nickname" placeholder="자동 추천 닉네임 사용 가능" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-name">본명</Label>
            <Input id="signup-name" placeholder="교강사에게만 보이게" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[28px] border border-border/70 bg-background/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><ShieldCheck className="size-4 text-primary" />이메일 인증</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">인증 완료 전 상태 배지와 안내 문구를 제공</p>
          </div>
          <div className="rounded-[28px] border border-border/70 bg-background/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="size-4 text-primary" />닉네임 추천</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">중복 처리용 자동 생성 흐름을 카드로 노출</p>
          </div>
          <div className="rounded-[28px] border border-border/70 bg-background/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><RefreshCw className="size-4 text-primary" />JWT / RFR 준비</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">토큰 발급 로직은 추후 연결 예정으로 안내</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-dashed border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground">추천 닉네임</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["모두달리기42", "새벽코더77", "푸른리스트12"].map((nickname) => (
              <Badge key={nickname} variant="outline" className="px-3 py-1.5">{nickname}</Badge>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">본명은 교강사 뷰에서만 보이도록 표시되며, 수강생 뷰에는 닉네임만 노출되는 구조를 기준으로 합니다.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button size="lg">회원가입 완료</Button>
          <Button asChild variant="ghost">
            <Link href="/login">이미 계정이 있어요</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
