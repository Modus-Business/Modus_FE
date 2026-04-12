"use client";

import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  FileUp,
  Flag,
  Hash,
  PencilLine,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

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

type TriggerButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size" | "variant"
>;
const NOTICE_EDIT_TEXTAREA_MAX_HEIGHT = 240;

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

function regenerateClassCodeValue(currentCode: string) {
  const [prefix, suffix] = currentCode.split("-");
  const nextSuffixLength = suffix?.length ?? 4;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const nextSuffix = Array.from(
    { length: nextSuffixLength },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");

  return prefix ? `${prefix}${nextSuffix}` : nextSuffix;
}

function getNoticePreviewLine(content: string, fallbackSummary?: string) {
  const firstContentLine = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  return firstContentLine ?? fallbackSummary ?? "";
}

export function JoinClassDialog({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "default"}
          size={iconOnly ? "icon" : "default"}
          className={
            iconOnly
              ? "size-11 rounded-full text-foreground hover:bg-secondary"
              : undefined
          }
          aria-label={iconOnly ? "수업 참여" : undefined}
        >
          {iconOnly ? (
            <Plus className="size-5" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {!iconOnly ? "수업 참여" : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수업 참여</DialogTitle>
          <DialogDescription>
            수업 코드를 입력하기 전에 아래 안내를 먼저 확인해 주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="join-code">수업 코드</Label>
            <Input id="join-code" placeholder="예: MODUS7J2Q" />
          </div>
          <div className="rounded-[24px] bg-muted px-5 py-4 text-sm leading-8 text-foreground">
            <p className="font-semibold">수업 코드로 로그인하는 방법</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>승인된 계정을 사용하세요.</li>
              <li>
                수업 코드는 공백이나 기호를 포함하지 않는 문자 또는 숫자
                5~8자리여야 합니다.
              </li>
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

export function CreateClassDialog({
  iconOnly = false,
  pending = false,
  onSubmit,
}: {
  iconOnly?: boolean;
  pending?: boolean;
  onSubmit?: (payload: { name: string; description: string }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const classDescriptionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = classDescriptionTextareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, NOTICE_EDIT_TEXTAREA_MAX_HEIGHT)}px`;
  }, [classDescription]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = className.trim();
    const nextDescription = classDescription.trim();

    if (!nextName) {
      return;
    }

    try {
      await onSubmit?.({
        name: nextName,
        description: nextDescription,
      });
    } catch {
      return;
    }

    setClassName("");
    setClassDescription("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "default"}
          size={iconOnly ? "icon" : "default"}
          className={
            iconOnly
              ? "size-11 rounded-full text-foreground hover:bg-secondary"
              : undefined
          }
          aria-label={iconOnly ? "수업 만들기" : undefined}
        >
          <Plus className={iconOnly ? "size-5" : "size-4"} />
          {!iconOnly ? "수업 만들기" : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 수업 만들기</DialogTitle>
          <DialogDescription>
            수업명과 간단한 수업 소개를 함께 입력해 새 수업의 기본 정보를
            정리합니다.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-2" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="class-name">수업명</Label>
            <Input
              id="class-name"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="예: 프로덕트 스튜디오"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="class-description">수업 소개</Label>
            <Textarea
              ref={classDescriptionTextareaRef}
              id="class-description"
              value={classDescription}
              onChange={(event) => setClassDescription(event.target.value)}
              placeholder="예: 서비스 구조 설계와 퍼블리싱을 함께 진행하는 메인 실습 수업"
              className="min-h-[140px] max-h-[240px] resize-none overflow-y-auto"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>취소</Button>
            </DialogClose>
            <Button type="submit" disabled={className.trim().length === 0 || pending}>
              {pending ? "생성 중..." : "생성하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NoticesDialog({
  notices,
  triggerProps,
  detailTitlePrefix,
  allowManage = false,
}: {
  notices: NoticeItem[];
  triggerProps?: TriggerButtonProps;
  detailTitlePrefix?: string;
  allowManage?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [noticeItems, setNoticeItems] = useState(notices);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const noticeEditTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setNoticeItems(notices);
  }, [notices]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = noticeEditTextareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, NOTICE_EDIT_TEXTAREA_MAX_HEIGHT)}px`;
  }, [draftContent, isEditing]);

  const selectedNotice = selectedNoticeId
    ? (noticeItems.find((notice) => notice.id === selectedNoticeId) ?? null)
    : null;
  const isDetailView = selectedNotice !== null;

  function resetDraft() {
    setDraftTitle("");
    setDraftContent("");
  }

  function openEditMode(notice: NoticeItem) {
    setDraftTitle(notice.title);
    setDraftContent(notice.content);
    setIsEditing(true);
  }

  function closeEditMode() {
    setIsEditing(false);
    resetDraft();
  }

  function saveNotice() {
    if (!selectedNotice) {
      return;
    }

    setNoticeItems((currentNotices) =>
      currentNotices.map((notice) =>
        notice.id === selectedNotice.id
          ? {
              ...notice,
              title: draftTitle.trim(),
              summary: getNoticePreviewLine(draftContent, notice.summary),
              content: draftContent.trim(),
            }
          : notice,
      ),
    );
    closeEditMode();
  }

  function deleteNotice() {
    if (!selectedNotice) {
      return;
    }

    setNoticeItems((currentNotices) =>
      currentNotices.filter((notice) => notice.id !== selectedNotice.id),
    );
    setSelectedNoticeId(null);
    setIsDeleteConfirmOpen(false);
    closeEditMode();
  }

  function requestDeleteNotice() {
    if (!selectedNotice) {
      return;
    }

    setIsDeleteConfirmOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedNoticeId(null);
      setIsDeleteConfirmOpen(false);
      closeEditMode();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" {...triggerProps}>
          <Bell className="size-4" />
          공지
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:w-[min(92vw,44rem)]">
        {isDetailView && selectedNotice ? (
          isEditing ? (
            <>
              <DialogHeader className="gap-3 pr-8">
                <div className="space-y-2">
                  <DialogTitle>공지 수정</DialogTitle>
                  <DialogDescription>{selectedNotice.date}</DialogDescription>
                </div>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="grid gap-4 rounded-3xl border border-border/70 bg-background/70 p-5">
                  <div className="grid gap-2">
                    <Label htmlFor={`notice-edit-title-${selectedNotice.id}`}>
                      공지 제목
                    </Label>
                    <Input
                      id={`notice-edit-title-${selectedNotice.id}`}
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      placeholder="공지 제목을 입력하세요"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`notice-edit-content-${selectedNotice.id}`}>
                      공지 본문
                    </Label>
                    <Textarea
                      ref={noticeEditTextareaRef}
                      id={`notice-edit-content-${selectedNotice.id}`}
                      value={draftContent}
                      onChange={(event) => setDraftContent(event.target.value)}
                      placeholder="학생에게 전달할 공지 본문을 입력하세요"
                      className="min-h-[140px] max-h-[240px] resize-none overflow-y-auto"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 border-t border-border/70 bg-card/95 px-6 py-4 backdrop-blur">
                <Button variant="outline" onClick={closeEditMode}>
                  취소
                </Button>
                <Button
                  onClick={saveNotice}
                  disabled={
                    draftTitle.trim().length === 0 ||
                    draftContent.trim().length === 0
                  }
                >
                  저장하기
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="gap-3 pr-8">
                <div className="space-y-2">
                  <DialogTitle className="flex items-center gap-2">
                    {detailTitlePrefix ? (
                      <>
                        <span>{detailTitlePrefix}</span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                        <span>{selectedNotice.title}</span>
                      </>
                    ) : (
                      selectedNotice.title
                    )}
                  </DialogTitle>
                  <div className="flex items-center justify-between gap-3">
                    <DialogDescription>{selectedNotice.date}</DialogDescription>
                    {allowManage ? (
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label="공지 수정"
                          onClick={() => openEditMode(selectedNotice)}
                        >
                          <PencilLine className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600"
                          aria-label="공지 삭제"
                          onClick={requestDeleteNotice}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                  <div className="space-y-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
                    {selectedNotice.content}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">닫기</Button>
                </DialogClose>
                <Button
                  variant="outline"
                  onClick={() => setSelectedNoticeId(null)}
                >
                  목록으로
                </Button>
              </DialogFooter>
              <Dialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
              >
                <DialogContent className="sm:w-[min(92vw,28rem)]">
                  <DialogHeader>
                    <DialogTitle>공지 삭제</DialogTitle>
                    <DialogDescription>
                      {selectedNotice.title} 공지를 삭제하시겠습니까? 삭제
                      후에는 목록에서 바로 사라집니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                    >
                      취소
                    </Button>
                    <Button variant="destructive" onClick={deleteNotice}>
                      삭제하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>공지</DialogTitle>
              <DialogDescription>
                공지 항목을 선택하면 자세한 내용을 바로 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            {noticeItems.length > 0 ? (
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {noticeItems.map((notice) => (
                  <button
                    key={notice.id}
                    type="button"
                    onClick={() => setSelectedNoticeId(notice.id)}
                    className="group w-full rounded-3xl border border-border/70 bg-background/70 p-4 text-left transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/35 hover:bg-primary/[0.05] hover:shadow-[0_14px_32px_rgba(91,132,255,0.08)] focus-visible:border-primary/45 focus-visible:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:outline-none"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
                          {notice.title}
                        </p>
                        <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-muted-foreground transition-colors duration-200 group-hover:text-foreground/75 group-focus-visible:text-foreground/75">
                          {getNoticePreviewLine(notice.content, notice.summary)}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {notice.date}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/70 bg-background/60 px-5 py-8 text-center text-sm leading-6 text-muted-foreground">
                등록된 공지사항이 없습니다.
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ClassCodeDialog({
  classCode,
  pending = false,
  onRegenerate,
  triggerProps,
}: {
  classCode: string;
  pending?: boolean;
  onRegenerate?: (currentCode: string) => Promise<string> | string;
  triggerProps?: TriggerButtonProps;
}) {
  const [generatedCode, setGeneratedCode] = useState(classCode);

  useEffect(() => {
    setGeneratedCode(classCode);
  }, [classCode]);

  async function handleRegenerate() {
    if (onRegenerate) {
      const nextCode = await onRegenerate(generatedCode);
      setGeneratedCode(nextCode);
      return;
    }

    setGeneratedCode(regenerateClassCodeValue(generatedCode));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" {...triggerProps}>
          <Hash className="size-4" />
          수업 코드
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수업 코드</DialogTitle>
          <DialogDescription>
            학생에게 안내할 수업 코드를 여기에서 확인하고 공유해 보세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <div className="rounded-[28px] border border-primary/20 bg-primary/5 px-5 py-5 text-center">
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              Class Code
            </p>
            <p className="mt-3 break-all text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {generatedCode}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleRegenerate}
          >
            {pending ? "재발급 중..." : "코드 재발급"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AssignmentSummaryDialog({
  assignments,
  triggerProps,
}: {
  assignments: AssignmentSummary[];
  triggerProps?: TriggerButtonProps;
}) {
  const pendingCount = assignments.filter(
    (assignment) => assignment.status === "제출 전",
  ).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/88" {...triggerProps}>
          <Flag className="size-4 text-primary" />
          모둠 과제
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[82vh] w-[min(92vw,44rem)] overflow-y-auto p-0">
        <div className="border-b border-border/70 px-6 py-6">
          <DialogHeader>
            <DialogTitle>모둠 과제</DialogTitle>
            <DialogDescription>
              지금 진행 중인 과제와 마감 일정을 모아서 확인합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant={pendingCount > 0 ? "warning" : "success"}
              className="rounded-full px-3 py-1"
            >
              {pendingCount > 0
                ? `제출 전 ${pendingCount}건`
                : "급한 제출 없음"}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              총 {assignments.length}건
            </Badge>
          </div>
        </div>

        <div className="space-y-3 px-6 py-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-[24px] border border-border/70 bg-background/75 px-5 py-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {assignment.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    마감 · {assignment.dueAt}
                  </p>
                </div>
                <Badge
                  variant={getAssignmentBadgeVariant(assignment.status)}
                  className="shrink-0"
                >
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

export function SubmitAssignmentDialog({
  className,
  triggerProps,
}: {
  className: string;
  triggerProps?: TriggerButtonProps;
}) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...triggerProps}>
          <FileUp className="size-4" />
          과제 제출
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{className} 과제 제출</DialogTitle>
          <DialogDescription>
            결과물은 파일 업로드 또는 링크 첨부 방식으로 제출할 수 있습니다.
          </DialogDescription>
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
                {selectedFileName
                  ? selectedFileName
                  : "PDF, PPT, 이미지, 압축 파일 등 제출물을 업로드합니다."}
              </span>
            </Label>
            {selectedFileName ? (
              <p className="text-xs font-medium text-primary">
                선택된 파일: {selectedFileName}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border/70" />
            <span className="text-xs font-medium text-muted-foreground">
              또는
            </span>
            <div className="h-px flex-1 bg-border/70" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignment-link">결과물 링크</Label>
            <Input
              id="assignment-link"
              placeholder="제출할 결과물 링크를 입력하세요"
            />
          </div>
        </div>
        <DialogFooter>
          <Button>제출하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewNoticeDialog({
  pending = false,
  onSubmit,
}: {
  pending?: boolean;
  onSubmit?: (payload: { title: string; content: string }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const noticeCreateTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = noticeCreateTextareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, NOTICE_EDIT_TEXTAREA_MAX_HEIGHT)}px`;
  }, [noticeBody]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = noticeTitle.trim();
    const nextContent = noticeBody.trim();

    if (!nextTitle || !nextContent || !onSubmit) {
      return;
    }

    try {
      await onSubmit({
        title: nextTitle,
        content: nextContent,
      });
    } catch {
      return;
    }

    setNoticeTitle("");
    setNoticeBody("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />새 공지사항
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공지사항 작성</DialogTitle>
          <DialogDescription>
            교강사가 클래스 공지를 작성하고 학생에게 바로 안내할 수 있는 입력
            UI를 제공합니다.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-2" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="notice-title">공지 제목</Label>
            <Input
              id="notice-title"
              value={noticeTitle}
              onChange={(event) => setNoticeTitle(event.target.value)}
              placeholder="예: [필독] 2차 중간 점검 안내"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notice-body">공지 본문</Label>
            <Textarea
              ref={noticeCreateTextareaRef}
              id="notice-body"
              value={noticeBody}
              onChange={(event) => setNoticeBody(event.target.value)}
              placeholder="학생에게 전달할 핵심 내용과 제출 기준을 적어주세요."
              className="min-h-[140px] max-h-[240px] resize-none overflow-y-auto"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={noticeTitle.trim().length === 0 || noticeBody.trim().length === 0 || pending}>
              {pending ? "게시 중..." : "게시하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
