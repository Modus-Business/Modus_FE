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
};

type ArrangementTeam = TeacherClassroom["teams"][number];
type TeamNameDialogState =
  | { mode: "create" }
  | { mode: "rename"; teamId: string }
  | null;

export function TeamArrangementBoard({ classroom }: TeamArrangementBoardProps) {
  const [teams, setTeams] = useState<ArrangementTeam[]>(() => classroom.teams.map((team) => ({ ...team, memberIds: [...team.memberIds] })));
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
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
    setOpenStudentPickerId((current) => (current === studentId ? null : current));
  };

  const createGroup = (teamName: string) => {
    setTeams((currentTeams) => [
      ...currentTeams,
      {
        id: `temp-group-${Date.now()}-${currentTeams.length + 1}`,
        name: teamName,
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

  const openCreateGroupDialog = () => {
    setTeamNameDraft("");
    setTeamNameDialog({ mode: "create" });
  };

  const openRenameGroupDialog = (team: ArrangementTeam) => {
    setTeamNameDraft(team.name);
    setTeamNameDialog({ mode: "rename", teamId: team.id });
  };

  const submitTeamName = () => {
    const nextName = teamNameDraft.trim();
    if (!nextName || !teamNameDialog) return;

    if (teamNameDialog.mode === "create") {
      createGroup(nextName);
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
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={submitTeamName} disabled={teamNameDraft.trim().length === 0}>
              {teamNameDialog?.mode === "rename" ? "이름 변경" : "생성하기"}
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            <div className="sticky top-0 z-10 -mx-4 -mt-4 border-b border-border/60 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">미배치 학생</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">모둠에서 제외할 학생은 여기에 다시 드롭하세요.</p>
            </div>
            <div className="mt-6 space-y-2">
              {unassignedStudents.length > 0 ? (
                unassignedStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    draggable
                    data-testid={`unassigned-member-${student.id}`}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/student-id", student.id);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-white/95 px-3 py-3 text-left shadow-none"
                  >
                    <GripVertical className="size-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{student.realName}</p>
                        {student.studentCode ? <span className="text-[11px] font-medium text-muted-foreground">{student.studentCode}</span> : null}
                      </div>
                    </div>
                  </button>
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
                  "rounded-[28px] border border-border/80 bg-background/70 p-4 transition-colors",
                  activeDropZone === team.id && "border-primary/50 bg-primary/5",
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
                        <button
                          key={student.id}
                          type="button"
                          draggable
                          data-testid={`team-member-${team.id}-${student.id}`}
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/student-id", student.id);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-3 py-3 text-left shadow-none"
                        >
                          <GripVertical className="size-4 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">{student.realName}</p>
                              {student.studentCode ? <span className="text-[11px] font-medium text-muted-foreground">{student.studentCode}</span> : null}
                            </div>
                          </div>
                        </button>
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
              className="flex min-h-[240px] items-center justify-center rounded-[28px] border border-dashed border-primary/30 bg-primary/5 text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
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
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {classroom.roster.map((student) => {
            const assignedTeam = teams.find((team) => team.memberIds.includes(student.id));
            const assignedTeamLabel = assignedTeam ? assignedTeam.name.split("·")[0]?.trim() ?? assignedTeam.name : "미배치";
            const pickerOpen = openStudentPickerId === student.id;
            return (
              <div
                key={student.id}
                data-testid={`student-card-${student.id}`}
                className="rounded-[24px] border border-border/70 bg-background/70 px-4 py-4 text-left shadow-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{student.realName}</p>
                      {student.studentCode ? <span className="text-[11px] font-medium text-muted-foreground">{student.studentCode}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge variant={assignedTeam ? "secondary" : "outline"} className="rounded-full px-3 py-1">
                    {assignedTeamLabel}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs text-muted-foreground"
                    onClick={() => setOpenStudentPickerId((current) => (current === student.id ? null : student.id))}
                    aria-label={`${student.realName} 모둠 이동`}
                  >
                    모둠 이동
                    <ChevronDown className={cn("size-4 transition-transform", pickerOpen && "rotate-180")} />
                  </Button>
                </div>
                {pickerOpen ? (
                  <div className="mt-3 space-y-2 rounded-2xl border border-border/70 bg-white/90 p-2">
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
