"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, GripVertical, PencilLine, Plus, Trash2, UsersRound } from "lucide-react";

import type { TeacherClassroom } from "../../lib/mock-data";
import { cn } from "../../lib/utils";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type TeamArrangementBoardProps = {
  classroom: TeacherClassroom;
  createGroupPending?: boolean;
  onCreateGroup?: (payload: { name: string }) => Promise<{
    id: string;
    name: string;
    memberCount: number;
  }> | {
    id: string;
    name: string;
    memberCount: number;
  };
};

type ArrangementTeam = TeacherClassroom["teams"][number];
type TeamNameDialogState =
  | { mode: "create" }
  | { mode: "rename"; teamId: string }
  | null;

const normalizeTeamName = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

export function TeamArrangementBoard({ classroom, createGroupPending = false, onCreateGroup }: TeamArrangementBoardProps) {
  const [teams, setTeams] = useState<ArrangementTeam[]>(() => classroom.teams.map((team) => ({ ...team, memberIds: [...team.memberIds] })));
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [draggingStudentId, setDraggingStudentId] = useState<string | null>(null);
  const [pendingDeleteTeamId, setPendingDeleteTeamId] = useState<string | null>(null);
  const [teamNameDialog, setTeamNameDialog] = useState<TeamNameDialogState>(null);
  const [teamNameDraft, setTeamNameDraft] = useState("");
  const [openStudentPickerId, setOpenStudentPickerId] = useState<string | null>(null);

  const rosterById = useMemo(
    () => new Map(classroom.roster.map((student) => [student.id, student])),
    [classroom.roster],
  );
  const assignedIds = useMemo(
    () => new Set(teams.flatMap((team) => team.memberIds)),
    [teams],
  );
  const unassignedStudents = classroom.roster.filter((student) => !assignedIds.has(student.id));

  const moveStudent = (studentId: string, targetTeamId?: string) => {
    setTeams((currentTeams) => {
      const nextTeams = currentTeams.map((team) => ({
        ...team,
        memberIds: team.memberIds.filter((memberId) => memberId !== studentId),
      }));

      if (!targetTeamId) {
        return nextTeams;
      }

      return nextTeams.map((team) =>
        team.id === targetTeamId
          ? { ...team, memberIds: [...team.memberIds, studentId] }
          : team,
      );
    });
    setActiveDropZone(null);
    setDraggingStudentId(null);
    setOpenStudentPickerId((current) => (current === studentId ? null : current));
  };

  const handleStudentDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    studentId: string,
  ) => {
    event.dataTransfer.setData("text/student-id", studentId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setDragImage(event.currentTarget, 24, 24);
    setDraggingStudentId(studentId);
    setOpenStudentPickerId((current) => (current === studentId ? null : current));
  };

  const handleStudentDragEnd = () => {
    setDraggingStudentId(null);
    setActiveDropZone(null);
  };

  const createGroup = (teamName: string, createdGroup?: { id: string; name: string; memberCount: number }) => {
    setTeams((currentTeams) => [
      ...currentTeams,
      {
        id: createdGroup?.id || `temp-group-${Date.now()}-${currentTeams.length + 1}`,
        name: createdGroup?.name || teamName,
        theme: "새 모둠",
        memberIds: [],
        submissionStatus: "제출 미완료",
      },
    ]);
  };

  const renameGroup = (teamId: string, teamName: string) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId
          ? { ...team, name: teamName }
          : team,
      ),
    );
  };

  const removeGroup = (teamId: string) => {
    setTeams((currentTeams) => currentTeams.filter((team) => team.id !== teamId));
    setActiveDropZone((current) => (current === teamId ? null : current));
    setPendingDeleteTeamId((current) => (current === teamId ? null : current));
  };

  const pendingDeleteTeam = teams.find((team) => team.id === pendingDeleteTeamId) ?? null;
  const pendingRenameTeam = teamNameDialog?.mode === "rename"
    ? teams.find((team) => team.id === teamNameDialog.teamId) ?? null
    : null;
  const nextTeamName = teamNameDraft.trim();
  const hasDuplicateTeamName = useMemo(() => {
    if (!teamNameDialog || nextTeamName.length === 0) {
      return false;
    }

    const normalizedDraft = normalizeTeamName(nextTeamName);

    return teams.some((team) => {
      if (teamNameDialog.mode === "rename" && team.id === teamNameDialog.teamId) {
        return false;
      }

      return normalizeTeamName(team.name) === normalizedDraft;
    });
  }, [nextTeamName, teamNameDialog, teams]);

  const openCreateGroupDialog = () => {
    setTeamNameDraft("");
    setTeamNameDialog({ mode: "create" });
  };

  const openRenameGroupDialog = (team: ArrangementTeam) => {
    setTeamNameDraft(team.name);
    setTeamNameDialog({ mode: "rename", teamId: team.id });
  };

  const submitTeamName = async () => {
    const nextName = teamNameDraft.trim();
    if (!nextName || !teamNameDialog || hasDuplicateTeamName) return;

    if (teamNameDialog.mode === "create") {
      if (onCreateGroup) {
        try {
          const createdGroup = await onCreateGroup({ name: nextName });
          createGroup(nextName, createdGroup);
        } catch {
          return;
        }
      } else {
        createGroup(nextName);
      }
    } else {
      renameGroup(teamNameDialog.teamId, nextName);
    }

    setTeamNameDialog(null);
    setTeamNameDraft("");
  };

  return (
    <div className="space-y-4">
      <Dialog
        open={teamNameDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTeamNameDialog(null);
            setTeamNameDraft("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{teamNameDialog?.mode === "rename" ? "모둠 이름 변경" : "새 모둠 추가"}</DialogTitle>
            <DialogDescription>
              {teamNameDialog?.mode === "rename"
                ? "현재 모둠 이름을 원하는 이름으로 수정해 보세요."
                : "생성할 모둠 이름을 입력해 주세요."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="team-name">모둠 이름</Label>
            <Input
              id="team-name"
              value={teamNameDraft}
              onChange={(event) => setTeamNameDraft(event.target.value)}
              placeholder={pendingRenameTeam?.name ?? "예: 모둠 1"}
              aria-invalid={hasDuplicateTeamName}
              autoFocus
            />
            {hasDuplicateTeamName ? (
              <p className="text-sm text-destructive">같은 이름의 모둠은 생성할 수 없습니다.</p>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={submitTeamName} disabled={nextTeamName.length === 0 || hasDuplicateTeamName || createGroupPending}>
              {teamNameDialog?.mode === "rename" ? "이름 변경" : createGroupPending ? "생성 중..." : "생성하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pendingDeleteTeam !== null} onOpenChange={(open) => {
        if (!open) {
          setPendingDeleteTeamId(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              {pendingDeleteTeam
                ? `${pendingDeleteTeam.name}을(를) 삭제하면 해당 학생들은 모두 미배치 학생으로 돌아갑니다.`
                : "삭제할 모둠을 확인해 주세요."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteTeam) {
                  removeGroup(pendingDeleteTeam.id);
                }
              }}
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-white/95">
        <CardHeader className="gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />모둠 배치</CardTitle>
            <CardDescription>학생을 드래그해서 원하는 모둠에 배치하고, 필요하면 새 모둠을 추가해 보세요.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>전체 {classroom.roster.length}명</span>
            <span>미배치 {unassignedStudents.length}명</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div
            className={cn(
              "rounded-[28px] border border-dashed border-border/80 bg-background/80 p-4 transition-colors xl:sticky xl:top-24 xl:max-h-[calc(100svh-9rem)] xl:self-start xl:overflow-y-auto",
              activeDropZone === "unassigned" && "border-primary/50 bg-primary/5",
            )}
            data-testid="unassigned-dropzone"
            onDragOver={(event) => {
              event.preventDefault();
              setActiveDropZone("unassigned");
            }}
            onDragLeave={() => setActiveDropZone((current) => (current === "unassigned" ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              const studentId = event.dataTransfer.getData("text/student-id");
              if (studentId) {
                moveStudent(studentId);
              }
            }}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 border-b border-border/60 bg-white/85 px-4 pt-4 pb-4 backdrop-blur-xl backdrop-saturate-150">
              <p className="text-sm font-semibold text-foreground">미배치 학생</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">모둠에서 제외할 학생은 여기에 다시 드롭하세요.</p>
            </div>
            <div className="mt-4 space-y-2">
              {unassignedStudents.length > 0 ? (
                unassignedStudents.map((student) => (
                  <div
                    key={student.id}
                    draggable
                    data-testid={`unassigned-member-${student.id}`}
                    onDragStart={(event) => handleStudentDragStart(event, student.id)}
                    onDragEnd={handleStudentDragEnd}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/95 px-3 py-3 text-left shadow-none transition-[opacity,transform,box-shadow,border-color] duration-150",
                      draggingStudentId === student.id && "border-primary/40 opacity-70 shadow-[0_12px_28px_rgba(91,132,255,0.16)]"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <GripVertical className="size-4 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{student.realName}</p>
                      </div>
                    </div>
                    <span className="group relative inline-flex shrink-0 cursor-help items-center rounded-full border border-primary/15 bg-primary/5 px-2 py-1 text-[11px] font-semibold lowercase tracking-[0.01em] text-primary">
                      email
                      <span className="pointer-events-none absolute top-[calc(100%+0.55rem)] right-0 z-30 w-max max-w-[220px] translate-y-1 rounded-2xl border border-sky-100 bg-white/98 px-3 py-2 text-xs font-medium normal-case text-foreground opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                        {student.email ?? "이메일 정보 없음"}
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-white/80 px-4 py-5 text-sm text-muted-foreground">모든 학생이 모둠에 배치되었습니다.</div>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className={cn(
                  "rounded-[28px] border border-border/80 bg-background/70 p-4 transition-[background-color,border-color,box-shadow] duration-150",
                  activeDropZone === team.id && "border-primary/45 bg-[#f7faff] shadow-[inset_0_0_0_1px_rgba(91,132,255,0.14),0_10px_24px_rgba(91,132,255,0.08)]",
                )}
                data-testid={`team-dropzone-${team.id}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropZone(team.id);
                }}
                onDragLeave={() => setActiveDropZone((current) => (current === team.id ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  const studentId = event.dataTransfer.getData("text/student-id");
                  if (studentId) {
                    moveStudent(studentId, team.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-foreground">{team.name}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">구성원 {team.memberIds.length}명</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                      aria-label={`${team.name} 이름 변경`}
                      onClick={() => openRenameGroupDialog(team)}
                    >
                      <PencilLine className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      aria-label={`${team.name} 삭제`}
                      onClick={() => setPendingDeleteTeamId(team.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {team.memberIds.length > 0 ? (
                    team.memberIds.map((memberId) => {
                      const student = rosterById.get(memberId);
                      if (!student) return null;
                      return (
                        <div
                          key={student.id}
                          draggable
                          data-testid={`team-member-${team.id}-${student.id}`}
                          onDragStart={(event) => handleStudentDragStart(event, student.id)}
                          onDragEnd={handleStudentDragEnd}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/95 px-3 py-3 text-left shadow-none transition-[opacity,transform,box-shadow,border-color] duration-150",
                            draggingStudentId === student.id && "border-primary/40 opacity-70 shadow-[0_12px_28px_rgba(91,132,255,0.16)]"
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <GripVertical className="size-4 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">{student.realName}</p>
                            </div>
                          </div>
                          <span className="group relative inline-flex shrink-0 cursor-help items-center rounded-full border border-primary/15 bg-primary/5 px-2 py-1 text-[11px] font-semibold lowercase tracking-[0.01em] text-primary">
                            email
                            <span className="pointer-events-none absolute top-[calc(100%+0.55rem)] right-0 z-30 w-max max-w-[220px] translate-y-1 rounded-2xl border border-sky-100 bg-white/98 px-3 py-2 text-xs font-medium normal-case text-foreground opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                              {student.email ?? "이메일 정보 없음"}
                            </span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-white/75 px-4 py-6 text-sm text-muted-foreground">
                      여기에 학생을 드롭해 모둠을 구성하세요.
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={openCreateGroupDialog}
              data-testid="add-group-button"
              className="flex min-h-[200px] items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-primary/5 px-6 py-8 text-primary transition-colors hover:border-primary/50 hover:bg-primary/10 sm:min-h-[220px] lg:min-h-[240px]"
            >
              <span className="flex flex-col items-center gap-3">
                <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-none">
                  <Plus className="size-7" />
                </span>
                <span className="text-base font-semibold">새 모둠 추가</span>
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle>전체 학생</CardTitle>
          <CardDescription>학생 전체를 확인하면서 현재 배치된 모둠을 보고 바로 변경할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {classroom.roster.map((student) => {
            const assignedTeam = teams.find((team) => team.memberIds.includes(student.id));
            const assignedTeamLabel = assignedTeam ? assignedTeam.name.split("·")[0]?.trim() ?? assignedTeam.name : "미배치";
            const pickerOpen = openStudentPickerId === student.id;
            return (
              <div
                key={student.id}
                data-testid={`student-card-${student.id}`}
                className={cn(
                  "relative rounded-[24px] border border-border/70 bg-background/70 px-4 py-4 text-left shadow-none overflow-visible",
                  pickerOpen && "z-20",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{student.realName}</p>
                      <div className="relative">
                        <button
                          type="button"
                          className="group inline-flex cursor-help items-center rounded-full border border-primary/15 bg-primary/5 px-2 py-1 text-[11px] font-semibold lowercase tracking-[0.01em] text-primary outline-none transition-colors hover:border-primary/30 hover:bg-primary/10 focus-visible:border-primary/40 focus-visible:bg-primary/10"
                          aria-label={`${student.realName} 이메일 보기`}
                        >
                          email
                          <span className="pointer-events-none absolute top-[calc(100%+0.55rem)] left-1/2 z-30 w-max max-w-[220px] -translate-x-1/2 translate-y-1 rounded-2xl border border-sky-100 bg-white/98 px-3 py-2 text-xs font-medium normal-case text-foreground opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                            {student.email ?? "이메일 정보 없음"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <Badge variant={assignedTeam ? "secondary" : "outline"} className="rounded-full px-3 py-1">
                    {assignedTeamLabel}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-full px-3 text-xs text-muted-foreground"
                    onClick={() => setOpenStudentPickerId((current) => (current === student.id ? null : student.id))}
                    aria-label={`${student.realName} 모둠 이동`}
                  >
                    모둠 이동
                    <ChevronDown className={cn("size-4 transition-transform", pickerOpen && "rotate-180")} />
                  </Button>
                </div>
                {pickerOpen ? (
                  <div className="absolute right-4 left-4 top-[calc(100%-0.5rem)] space-y-2 rounded-2xl border border-border/70 bg-white/95 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                    {teams.length > 0 ? (
                      teams.map((team) => {
                        const teamLabel = team.name.split("·")[0]?.trim() ?? team.name;
                        const isCurrentTeam = assignedTeam?.id === team.id;
                        return (
                          <button
                            key={team.id}
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                              isCurrentTeam ? "bg-secondary text-foreground" : "hover:bg-accent hover:text-accent-foreground",
                            )}
                            onClick={() => moveStudent(student.id, team.id)}
                          >
                            <span>{teamLabel}</span>
                            {isCurrentTeam ? <Check className="size-4 text-primary" /> : null}
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">먼저 모둠을 생성해 주세요.</p>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
