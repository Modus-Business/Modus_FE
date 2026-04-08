export type UserRole = "student" | "teacher";

export type UserProfile = {
  nickname: string;
  realName: string;
  email: string;
  descriptor: string;
  footerNote: string;
};

export type NoticeItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  pinned?: boolean;
};

export type ChatMessage = {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  own?: boolean;
};

export type MemberProfile = {
  id: string;
  nickname: string;
  realName: string;
  status: "online" | "focus" | "away";
  roleLabel: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  topic: string;
  members: MemberProfile[];
  messages: ChatMessage[];
};

export type AssignmentSummary = {
  id: string;
  title: string;
  dueAt: string;
  status: string;
};

export type StudentClassroom = {
  id: string;
  name: string;
  code: string;
  schedule: string;
  description: string;
  track: string;
  nextSession: string;
  teamName?: string;
  notices: NoticeItem[];
  assignments: AssignmentSummary[];
  group?: GroupSummary;
};

export type TeacherClassroom = {
  id: string;
  name: string;
  code: string;
  schedule: string;
  description: string;
  cohort: string;
  teamCount: number;
  studentCount: number;
  notices: NoticeItem[];
  teams: Array<{
    id: string;
    name: string;
    theme: string;
    members: number;
    submissionStatus: string;
  }>;
};

export const studentProfile: UserProfile = {
  nickname: "모두달리기42",
  realName: "최민수",
  email: "minsu@modus.ac.kr",
  descriptor: "Frontend Track",
  footerNote: "오늘도 모둠 과제를 한 단계 더 정리해봐요.",
};

export const teacherProfile: UserProfile = {
  nickname: "coach_pj",
  realName: "김필재",
  email: "piljae@modus.ac.kr",
  descriptor: "교강사 · Program Lead",
  footerNote: "수업 흐름과 공지 전달을 한 화면에서 관리합니다.",
};

const studentGroup: GroupSummary = {
  id: "group-sprint-03",
  name: "모둠 3 · 스프린트",
  topic: "수강생용 클래스룸 메인 퍼블리싱 정리",
  members: [
    {
      id: "m1",
      nickname: "모두달리기42",
      realName: "최민수",
      status: "online",
      roleLabel: "발표 담당",
    },
    {
      id: "m2",
      nickname: "청설모코더",
      realName: "박서윤",
      status: "focus",
      roleLabel: "UI 구조",
    },
    {
      id: "m3",
      nickname: "야행성토끼",
      realName: "이도윤",
      status: "online",
      roleLabel: "콘텐츠 정리",
    },
    {
      id: "m4",
      nickname: "노트북바람",
      realName: "정하린",
      status: "away",
      roleLabel: "QA 체크",
    }
  ],
  messages: [
    {
      id: "c1",
      author: "청설모코더",
      handle: "@seo.yoon",
      time: "오후 7:14",
      content: "메인 카드 간격은 24px 기준으로 맞추고, 헤더는 클래스룸처럼 넓게 가져가면 좋겠어요."
    },
    {
      id: "c2",
      author: "야행성토끼",
      handle: "@doyoon",
      time: "오후 7:16",
      content: "공지 버튼은 팝업으로 빼고, 오른쪽 멤버 영역은 고정 폭으로 두면 균형이 좋아요."
    },
    {
      id: "c3",
      author: "모두달리기42",
      handle: "@minsu",
      time: "오후 7:18",
      content: "좋아요. 메인 톤은 첫 레퍼런스처럼 밝은 블루 계열로 통일해볼게요 👌",
      own: true
    }
  ]
};

export const studentClassrooms: StudentClassroom[] = [
  {
    id: "product-studio",
    name: "프로덕트 스튜디오",
    code: "MODUS-7J2Q",
    schedule: "화 · 목 19:00 - 21:00",
    description: "서비스 구조 설계와 퍼블리싱을 함께 진행하는 메인 실습 수업",
    track: "Frontend Core",
    nextSession: "오늘 19:00 · 피그마 리뷰",
    teamName: studentGroup.name,
    group: studentGroup,
    notices: [
      {
        id: "sn1",
        title: "2차 중간 점검 공지",
        date: "2026-04-07",
        summary: "금일 수업 시작 10분 전까지 시안 링크와 담당 역할을 정리해 주세요.",
        pinned: true
      },
      {
        id: "sn2",
        title: "발표 자료 템플릿 공유",
        date: "2026-04-05",
        summary: "공용 발표 슬라이드 템플릿이 업데이트되었습니다."
      },
      {
        id: "sn3",
        title: "과제 제출 포맷 안내",
        date: "2026-04-02",
        summary: "작업 링크, 요약, 역할 분담표를 함께 제출합니다."
      }
    ],
    assignments: [
      {
        id: "sa1",
        title: "모둠 과제 2차 시안 제출",
        dueAt: "오늘 23:59",
        status: "제출 전"
      },
      {
        id: "sa2",
        title: "컴포넌트 우선순위 정리",
        dueAt: "금요일 18:00",
        status: "진행 중"
      }
    ]
  },
  {
    id: "design-writing",
    name: "디자인 라이팅 워크숍",
    code: "WRITE-19B4",
    schedule: "토 13:00 - 15:00",
    description: "텍스트 톤앤매너와 설명형 UI 문구를 다듬는 보조 워크숍",
    track: "Elective",
    nextSession: "토요일 13:00 · 문장 리뷰",
    notices: [
      {
        id: "wn1",
        title: "모둠 배정 예정 안내",
        date: "2026-04-06",
        summary: "이번 주 수업에서 모둠이 배정될 예정입니다.",
        pinned: true
      },
      {
        id: "wn2",
        title: "사전 과제 업로드",
        date: "2026-04-01",
        summary: "읽어올 레퍼런스 문장을 정리해 주세요."
      }
    ],
    assignments: [
      {
        id: "wa1",
        title: "문장 톤 분석 리포트",
        dueAt: "토요일 10:00",
        status: "검토 대기"
      }
    ]
  }
];

export const teacherClassrooms: TeacherClassroom[] = [
  {
    id: "product-studio",
    name: "프로덕트 스튜디오",
    code: "MODUS-7J2Q",
    schedule: "화 · 목 19:00 - 21:00",
    description: "서비스형 결과물을 만드는 메인 프로젝트 수업",
    cohort: "2026 Spring",
    teamCount: 5,
    studentCount: 21,
    notices: [
      {
        id: "tn1",
        title: "2차 중간 점검 공지",
        date: "2026-04-07",
        summary: "오늘은 각 모둠의 정보 구조와 화면 플로우를 확인합니다.",
        pinned: true
      },
      {
        id: "tn2",
        title: "공지사항 작성 규칙",
        date: "2026-04-04",
        summary: "중요 공지는 제목 앞에 [필독]을 붙여 주세요."
      },
      {
        id: "tn3",
        title: "디스코드 채널 사용 안내",
        date: "2026-04-02",
        summary: "모둠 채널에서는 작업 링크를 고정 메시지로 관리합니다."
      }
    ],
    teams: [
      {
        id: "tg1",
        name: "모둠 1 · 탐색",
        theme: "리서치 구조화",
        members: 4,
        submissionStatus: "확인 완료"
      },
      {
        id: "tg2",
        name: "모둠 2 · 인터랙션",
        theme: "대시보드 설계",
        members: 4,
        submissionStatus: "검토 중"
      },
      {
        id: "tg3",
        name: "모둠 3 · 스프린트",
        theme: "클래스룸 퍼블리싱",
        members: 4,
        submissionStatus: "제출 대기"
      }
    ]
  },
  {
    id: "service-blueprint",
    name: "서비스 블루프린트",
    code: "BLUE-3A9M",
    schedule: "월 20:00 - 22:00",
    description: "문제 정의부터 정보 설계까지 이어지는 전략형 수업",
    cohort: "2026 Spring",
    teamCount: 4,
    studentCount: 16,
    notices: [
      {
        id: "sb1",
        title: "리서치 질문지 제출",
        date: "2026-04-03",
        summary: "다음 수업 전 인터뷰 질문지 링크를 업로드해 주세요."
      }
    ],
    teams: [
      {
        id: "sbg1",
        name: "모둠 A · 인사이트",
        theme: "사용자 인터뷰",
        members: 4,
        submissionStatus: "확인 완료"
      },
      {
        id: "sbg2",
        name: "모둠 B · 구조",
        theme: "서비스 맵",
        members: 4,
        submissionStatus: "제출 전"
      }
    ]
  }
];

export function getStudentClassroom(classId: string) {
  return studentClassrooms.find((classroom) => classroom.id === classId);
}

export function getTeacherClassroom(classId: string) {
  return teacherClassrooms.find((classroom) => classroom.id === classId);
}
