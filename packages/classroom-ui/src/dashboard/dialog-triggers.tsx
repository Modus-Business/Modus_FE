"use client";

import { Bell, FileUp, Plus, UserPlus } from "lucide-react";

import type { NoticeItem } from "../lib/mock-data";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function JoinClassDialog({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "default"}
          size={iconOnly ? "icon" : "default"}
          className={iconOnly ? "size-11 rounded-full text-foreground hover:bg-secondary" : undefined}
          aria-label={iconOnly ? "수업 참여" : undefined}
        >
          <UserPlus className="size-4" />
          {!iconOnly ? "수업 참여" : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수업 참여</DialogTitle>
          <DialogDescription>수업 코드를 입력하기 전에 아래 안내를 먼저 확인해 주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="join-code">수업 코드</Label>
            <Input id="join-code" placeholder="예: MODUS-7J2Q" />
          </div>
          <div className="rounded-[24px] bg-muted px-5 py-4 text-sm leading-8 text-foreground">
            <p className="font-semibold">수업 코드로 로그인하는 방법</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>승인된 계정을 사용하세요.</li>
              <li>
                수업 코드는 공백이나 기호를 포함하지 않는 문자 또는 숫자 5~8자리여야 합니다.
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">닫기</Button>
          <Button>참여하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateClassDialog({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "default"}
          size={iconOnly ? "icon" : "default"}
          className={iconOnly ? "size-11 rounded-full text-foreground hover:bg-secondary" : undefined}
          aria-label={iconOnly ? "수업 만들기" : undefined}
        >
          <Plus className="size-4" />
          {!iconOnly ? "수업 만들기" : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 수업 만들기</DialogTitle>
          <DialogDescription>수업 명과 팀 코드를 만드는 흐름을 우선 퍼블리싱합니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="class-name">수업 명</Label>
            <Input id="class-name" placeholder="예: 프로덕트 스튜디오" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team-code">팀 코드 생성</Label>
            <Input id="team-code" placeholder="자동 생성 예정" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">취소</Button>
          <Button>생성하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NoticesDialog({ notices }: { notices: NoticeItem[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell className="size-4" />
          공지 보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>공지사항</DialogTitle>
          <DialogDescription>클래스 공지사항을 팝업 형태로 확인합니다.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{notice.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.summary}</p>
                </div>
                <span className="text-xs text-muted-foreground">{notice.date}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SubmitAssignmentDialog({ className }: { className: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileUp className="size-4" />
          과제 제출
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{className} 과제 제출</DialogTitle>
          <DialogDescription>모둠별 제출 버튼 위치와 폼 구조를 먼저 맞춰둔 퍼블리싱 화면입니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="assignment-link">결과물 링크</Label>
            <Input id="assignment-link" placeholder="Figma / Vercel / GitHub 링크" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignment-note">설명</Label>
            <Textarea id="assignment-note" placeholder="이번 제출에서 업데이트한 내용을 적어주세요." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">임시 저장</Button>
          <Button>제출하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewNoticeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          새 공지사항
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공지사항 작성</DialogTitle>
          <DialogDescription>실제 저장 전, 제목/본문/노출 우선순위 중심의 입력 UI를 제공합니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="notice-title">공지 제목</Label>
            <Input id="notice-title" placeholder="예: [필독] 2차 중간 점검 안내" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notice-body">공지 본문</Label>
            <Textarea id="notice-body" placeholder="학생에게 전달할 핵심 내용과 제출 기준을 적어주세요." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">미리보기</Button>
          <Button>게시하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
