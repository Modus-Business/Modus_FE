"use client";

import { useState } from "react";
import { Bell, FileUp, Flag, Plus, UserPlus } from "lucide-react";

import type { AssignmentSummary, NoticeItem } from "../../lib/mock-data";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

function getAssignmentBadgeVariant(status: string) {
  switch (status) {
    case "제출 전":
      return "warning" as const;
    case "진행 중":
      return "secondary" as const;
    default:
      return "success" as const;
  }
}

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
          {iconOnly ? <Plus className="size-5" /> : <UserPlus className="size-4" />}
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
              <li>수업 코드는 공백이나 기호를 포함하지 않는 문자 또는 숫자 5~8자리여야 합니다.</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
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
          <Plus className={iconOnly ? "size-5" : "size-4"} />
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
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
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
          공지
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>공지</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div>
                  <p className="font-semibold text-foreground">{notice.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.summary}</p>
                </div>
                <span className="text-xs text-muted-foreground">{notice.date}</span>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AssignmentSummaryDialog({ assignments }: { assignments: AssignmentSummary[] }) {
  const pendingCount = assignments.filter((assignment) => assignment.status === "제출 전").length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/88">
          <Flag className="size-4 text-primary" />
          모둠 과제
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[82vh] w-[min(92vw,44rem)] overflow-y-auto p-0">
        <div className="border-b border-border/70 px-6 py-6">
          <DialogHeader>
            <DialogTitle>모둠 과제</DialogTitle>
            <DialogDescription>지금 진행 중인 과제와 마감 일정을 모아서 확인합니다.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant={pendingCount > 0 ? "warning" : "success"} className="rounded-full px-3 py-1">
              {pendingCount > 0 ? `제출 전 ${pendingCount}건` : "급한 제출 없음"}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              총 {assignments.length}건
            </Badge>
          </div>
        </div>

        <div className="space-y-3 px-6 py-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-[24px] border border-border/70 bg-background/75 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">마감 · {assignment.dueAt}</p>
                </div>
                <Badge variant={getAssignmentBadgeVariant(assignment.status)} className="shrink-0">
                  {assignment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubmitAssignmentDialog({ className }: { className: string }) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
          <DialogDescription>결과물은 파일 업로드 또는 링크 첨부 방식으로 제출할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="assignment-file">결과물 파일</Label>
            <Input
              id="assignment-file"
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setSelectedFileName(file ? file.name : null);
              }}
            />
            <Label
              htmlFor="assignment-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/25 bg-[linear-gradient(180deg,rgba(91,132,255,0.08)_0%,rgba(91,132,255,0.02)_100%)] px-5 py-7 text-center transition hover:border-primary/40 hover:bg-[linear-gradient(180deg,rgba(91,132,255,0.12)_0%,rgba(91,132,255,0.04)_100%)]"
            >
              <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-primary/10">
                <FileUp className="size-6" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {selectedFileName ? "파일 선택 완료" : "파일 선택 또는 업로드"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {selectedFileName ? selectedFileName : "PDF, PPT, 이미지, 압축 파일 등 제출물을 업로드합니다."}
              </span>
            </Label>
            {selectedFileName ? <p className="text-xs font-medium text-primary">선택된 파일: {selectedFileName}</p> : null}
          </div>
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border/70" />
            <span className="text-xs font-medium text-muted-foreground">또는</span>
            <div className="h-px flex-1 bg-border/70" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignment-link">결과물 링크</Label>
            <Input id="assignment-link" placeholder="제출할 결과물 링크를 입력하세요" />
          </div>
        </div>
        <DialogFooter>
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
          <DialogClose asChild>
            <Button variant="outline">미리보기</Button>
          </DialogClose>
          <Button>게시하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
