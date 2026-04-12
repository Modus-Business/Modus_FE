"use client";

import Link from "next/link";
import { useState } from "react";
import { UsersRound } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EmptyState,
} from "@modus/classroom-ui";

import { useGroupDetailQuery } from "../../../hooks/use-group-detail";
import { useClassGroupsQuery } from "../../../hooks/use-create-class";
import { useClassSubmissionStatusesQuery } from "../../../hooks/use-assignment-submissions";
import type { TeacherClassroom } from "@modus/classroom-ui";
import type { AssignmentSubmissionStatus } from "../../../lib/assignments/service";
import type { ClassGroupSummary } from "../../../lib/classes/service";

type GroupStatusSectionProps = {
  classId: string;
  teams: TeacherClassroom["teams"];
};

function getSubmissionLabel(submission: AssignmentSubmissionStatus | undefined, fallback: string) {
  if (!submission) {
    return fallback || "제출 미완료";
  }

  return submission.isSubmitted ? "제출 완료" : "제출 미완료";
}

function formatSubmittedAt(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}. ${month}. ${day}. ${hour}:${minute}`;
}

function toSubmissionMap(submissions: AssignmentSubmissionStatus[] | undefined) {
  return new Map((submissions || []).map((submission) => [submission.groupId, submission]));
}

function toStatusTeams(
  groups: ClassGroupSummary[],
  submissions: Map<string, AssignmentSubmissionStatus>,
): TeacherClassroom["teams"] {
  return groups.map((group) => ({
    id: group.groupId,
    name: group.name,
    theme: "API",
    memberIds: group.members.map((member) => member.studentId),
    submissionStatus: getSubmissionLabel(submissions.get(group.groupId), "제출 미완료"),
  }));
}

export function GroupStatusSection({ classId, teams }: GroupStatusSectionProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const classGroupsQuery = useClassGroupsQuery(classId);
  const submissionsQuery = useClassSubmissionStatusesQuery(classId);
  const submissionsByGroupId = toSubmissionMap(submissionsQuery.data?.submissions);
  const displayTeams = classGroupsQuery.data
    ? toStatusTeams(classGroupsQuery.data.groups, submissionsByGroupId)
    : teams.map((team) => ({
      ...team,
      submissionStatus: getSubmissionLabel(submissionsByGroupId.get(team.id), team.submissionStatus),
    }));
  const selectedTeam = displayTeams.find((team) => team.id === selectedGroupId) || null;
  const selectedSubmission = selectedGroupId ? submissionsByGroupId.get(selectedGroupId) : undefined;
  const selectedSubmissionStatus = getSubmissionLabel(selectedSubmission, selectedTeam?.submissionStatus || "제출 미완료");
  const selectedSubmittedAt = formatSubmittedAt(selectedSubmission?.submittedAt || null);
  const groupDetailQuery = useGroupDetailQuery(selectedGroupId);

  return (
    <Card className="bg-white/95">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />모둠 현황</CardTitle>
          <CardDescription>각 모둠의 이름, 제출 여부, 구성원 수를 요약 카드로 보여줍니다.</CardDescription>
        </div>
        <Button asChild variant="outline" className="h-11 shrink-0">
          <Link href={`/class/${classId}/groups`}>모둠 배치하기</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {displayTeams.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {displayTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setSelectedGroupId(team.id)}
                className="rounded-3xl border border-border/70 bg-background/70 p-4 text-left transition hover:border-primary/25 hover:bg-primary/[0.04] focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{team.name}</p>
                  <Badge variant={team.submissionStatus === "제출 완료" ? "success" : "warning"}>{team.submissionStatus}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">구성원 {team.memberIds.length}명</p>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 생성된 모둠이 없습니다"
            description="모둠 배치하기에서 새 모둠을 추가하고 학생을 배치해 수업 구성을 시작해 보세요."
          />
        )}
      </CardContent>

      <Dialog open={Boolean(selectedGroupId)} onOpenChange={(open) => {
        if (!open) {
          setSelectedGroupId(null);
        }
      }}>
        <DialogContent className="sm:w-[min(92vw,32rem)]">
          <DialogHeader>
            <DialogTitle>{groupDetailQuery.data?.name || selectedTeam?.name || "모둠 정보"}</DialogTitle>
            <DialogDescription>
              모둠 구성원과 현재 조회 가능한 기본 정보를 확인합니다.
            </DialogDescription>
          </DialogHeader>

          {groupDetailQuery.isLoading ? (
            <div className="rounded-3xl border border-border/70 bg-background/70 px-5 py-6 text-sm text-muted-foreground">
              모둠 정보를 불러오는 중입니다.
            </div>
          ) : null}

          {groupDetailQuery.isError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700">
              모둠 정보를 불러오지 못했습니다.
            </div>
          ) : null}

          {groupDetailQuery.data ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{groupDetailQuery.data.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      구성원 {groupDetailQuery.data.memberCount}명
                    </p>
                  </div>
                  <Badge variant={selectedSubmissionStatus === "제출 완료" ? "success" : "warning"}>{selectedSubmissionStatus}</Badge>
                </div>
                <div className="mt-4 rounded-2xl border border-border/70 bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground">제출 정보</p>
                  <p className="mt-1 text-sm text-foreground">
                    {selectedSubmittedAt ? `제출 시간 ${selectedSubmittedAt}` : "아직 제출된 과제가 없습니다."}
                  </p>
                  {selectedSubmission?.fileUrl || selectedSubmission?.link ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedSubmission.fileUrl ? (
                        <Button asChild variant="outline" size="sm">
                          <a href={selectedSubmission.fileUrl} target="_blank" rel="noreferrer">
                            파일 확인
                          </a>
                        </Button>
                      ) : null}
                      {selectedSubmission.link ? (
                        <Button asChild variant="outline" size="sm">
                          <a href={selectedSubmission.link} target="_blank" rel="noreferrer">
                            링크 확인
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                {groupDetailQuery.data.members.map((member) => (
                  <div
                    key={member.groupMemberId}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white px-4 py-3"
                  >
                    <p className="text-sm font-medium text-foreground">{member.displayName}</p>
                    {member.isMe ? <Badge variant="secondary">나</Badge> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
