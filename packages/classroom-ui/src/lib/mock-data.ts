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
  content: string;
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
  studentCode?: string;
  email?: string;
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
  roster: MemberProfile[];
  teams: Array<{
    id: string;
    name: string;
    theme: string;
    memberIds: string[];
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
        content:
          "오늘 수업에서는 각 모둠의 정보 구조와 화면 흐름을 함께 점검합니다.\n\n수업 시작 10분 전까지 피그마 시안 링크, 담당 역할, 현재 고민 지점을 한 문서에 정리해 제출해 주세요.\n\n발표는 모둠별 5분 이내로 진행하며, 리뷰가 필요한 화면을 우선 순서대로 표시해 두면 피드백이 더 빠르게 진행됩니다.",
        pinned: true
      },
      {
        id: "sn2",
        title: "발표 자료 템플릿 공유",
        date: "2026-04-05",
        summary: "공용 발표 슬라이드 템플릿이 업데이트되었습니다.",
        content:
          "공용 발표 슬라이드 템플릿이 최신 버전으로 교체되었습니다.\n\n기존 템플릿을 사용 중이라면 표지와 역할 분담 페이지를 새 양식으로 맞춰 주세요.\n\n템플릿 링크는 클래스 자료실 상단에 고정되어 있습니다."
      },
      {
        id: "sn3",
        title: "과제 제출 포맷 안내",
        date: "2026-04-02",
        summary: "작업 링크, 요약, 역할 분담표를 함께 제출합니다.",
        content:
          "과제 제출 시에는 결과물 링크만 올리지 말고 작업 요약과 역할 분담표를 함께 첨부해 주세요.\n\n제출 양식은 작업 링크, 이번 주 변경 사항 3줄 요약, 팀원별 담당 영역 순서로 정리하면 됩니다.\n\n형식이 누락되면 피드백이 지연될 수 있습니다."
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
        content:
          "이번 주 수업에서는 간단한 자기소개와 관심 주제 공유 이후 모둠을 배정할 예정입니다.\n\n원하는 주제나 함께 작업해 보고 싶은 역할이 있다면 수업 전까지 메모해 와 주세요.\n\n모둠 배정 이후부터 채팅과 팀 활동 화면이 순차적으로 열립니다.",
        pinned: true
      },
      {
        id: "wn2",
        title: "사전 과제 업로드",
        date: "2026-04-01",
        summary: "읽어올 레퍼런스 문장을 정리해 주세요.",
        content:
          "다음 워크숍에서는 각자 인상 깊었던 서비스 문구를 함께 분석합니다.\n\n레퍼런스 문장 3개 이상을 캡처하거나 링크로 정리해 수업 전까지 업로드해 주세요.\n\n좋았던 이유와 아쉬웠던 이유를 한 줄씩 적어오면 토론이 훨씬 수월합니다."
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

const teacherProductStudioRoster: MemberProfile[] = ([
  ["tp1", "강민서", "2311", "online", "리서치"],
  ["tp2", "김도윤", "2315", "focus", "와이어프레임"],
  ["tp3", "박서윤", "2318", "online", "UI 설계"],
  ["tp4", "이하준", "2321", "away", "프론트엔드"],
  ["tp5", "최지우", "2324", "online", "사용자 인터뷰"],
  ["tp6", "윤서진", "2327", "focus", "디자인 시스템"],
  ["tp7", "정하린", "2331", "online", "콘텐츠 구조"],
  ["tp8", "한지호", "2334", "away", "프로토타이핑"],
  ["tp9", "오유나", "2337", "online", "QA 체크"],
  ["tp10", "송태윤", "2341", "focus", "데이터 정리"],
  ["tp11", "문가은", "2344", "online", "발표 자료"],
  ["tp12", "임준서", "2347", "away", "사용성 테스트"],
  ["tp13", "유채린", "2351", "online", "카피라이팅"],
  ["tp14", "조현우", "2354", "focus", "API 연동"],
  ["tp15", "배시은", "2357", "online", "시각 디자인"],
  ["tp16", "신예준", "2361", "away", "정보 구조"],
  ["tp17", "권서아", "2364", "online", "인터랙션"],
  ["tp18", "남도현", "2367", "focus", "프론트엔드"],
  ["tp19", "류하린", "2371", "online", "프로젝트 관리"],
  ["tp20", "장민재", "2374", "away", "리포트 정리"],
  ["tp21", "백서윤", "2377", "online", "문서화"],
] as Array<[string, string, string, MemberProfile["status"], string]>).map(([id, realName, studentCode, status, roleLabel]) => ({
  id,
  nickname: realName,
  realName,
  studentCode,
  email: `student${studentCode}@modus.ac.kr`,
  status,
  roleLabel,
}));

const teacherServiceBlueprintRoster: MemberProfile[] = ([
  ["sbp1", "김연우", "2411", "online", "서비스 맵"],
  ["sbp2", "박유진", "2414", "focus", "리서치"],
  ["sbp3", "이도현", "2417", "online", "문제 정의"],
  ["sbp4", "최하은", "2421", "away", "퍼실리테이션"],
  ["sbp5", "정민재", "2424", "online", "인터뷰 설계"],
  ["sbp6", "송지안", "2427", "focus", "여정 지도"],
  ["sbp7", "문서아", "2431", "online", "자료 정리"],
  ["sbp8", "윤지후", "2434", "away", "발표"],
  ["sbp9", "강나은", "2437", "online", "시장 조사"],
  ["sbp10", "임서준", "2441", "focus", "핵심 인사이트"],
  ["sbp11", "한채원", "2444", "online", "스토리보드"],
  ["sbp12", "오민규", "2447", "away", "QA"],
  ["sbp13", "장예은", "2451", "online", "프로세스 설계"],
  ["sbp14", "신도윤", "2454", "focus", "정리 노트"],
  ["sbp15", "유하람", "2457", "online", "시각화"],
  ["sbp16", "배도윤", "2461", "away", "피드백 반영"],
] as Array<[string, string, string, MemberProfile["status"], string]>).map(([id, realName, studentCode, status, roleLabel]) => ({
  id,
  nickname: realName,
  realName,
  studentCode,
  email: `student${studentCode}@modus.ac.kr`,
  status,
  roleLabel,
}));

export const teacherClassrooms: TeacherClassroom[] = [
  {
    id: "product-studio",
    name: "프로덕트 스튜디오",
    code: "MODUS-7J2Q",
    schedule: "화 · 목 19:00 - 21:00",
    description: "서비스형 결과물을 만드는 메인 프로젝트 수업",
    cohort: "2026 Spring",
    teamCount: 0,
    studentCount: teacherProductStudioRoster.length,
    notices: [
      {
        id: "tn1",
        title: "2차 중간 점검 공지",
        date: "2026-04-07",
        summary: "오늘은 각 모둠의 정보 구조와 화면 플로우를 확인합니다.",
        content:
          "오늘 수업에서는 각 모둠의 정보 구조와 핵심 화면 플로우를 중점적으로 확인합니다.\n\n모둠별 발표 순서를 미리 공유할 예정이니 시작 전까지 발표자와 시연 화면을 정리해 주세요.\n\n피드백은 정보 구조, 우선순위, 화면 간 연결성 기준으로 진행합니다.",
        pinned: true
      },
      {
        id: "tn2",
        title: "공지사항 작성 규칙",
        date: "2026-04-04",
        summary: "중요 공지는 제목 앞에 [필독]을 붙여 주세요.",
        content:
          "학생에게 반드시 확인이 필요한 공지는 제목 앞에 [필독]을 붙여 구분해 주세요.\n\n본문 첫 문단에는 해야 할 행동과 마감 시점을 먼저 적는 것이 좋습니다.\n\n길이가 긴 공지는 핵심 요약을 맨 위에 두고, 세부 기준은 항목별로 나누어 작성해 주세요."
      },
      {
        id: "tn3",
        title: "디스코드 채널 사용 안내",
        date: "2026-04-02",
        summary: "모둠 채널에서는 작업 링크를 고정 메시지로 관리합니다.",
        content:
          "모둠별 디스코드 채널에서는 최신 작업 링크를 반드시 고정 메시지로 관리해 주세요.\n\n링크가 여러 개일 경우 피그마, 문서, 배포 URL 순으로 정리하면 확인이 수월합니다.\n\n교강사 피드백이 필요한 경우에는 메시지 하단에 확인 요청 시간을 함께 남겨 주세요."
      }
    ],
    roster: teacherProductStudioRoster,
    teams: []
  },
  {
    id: "service-blueprint",
    name: "서비스 블루프린트",
    code: "BLUE-3A9M",
    schedule: "월 20:00 - 22:00",
    description: "문제 정의부터 정보 설계까지 이어지는 전략형 수업",
    cohort: "2026 Spring",
    teamCount: 0,
    studentCount: teacherServiceBlueprintRoster.length,
    notices: [
      {
        id: "sb1",
        title: "리서치 질문지 제출",
        date: "2026-04-03",
        summary: "다음 수업 전 인터뷰 질문지 링크를 업로드해 주세요.",
        content:
          "다음 수업 전까지 인터뷰 질문지 링크를 클래스 자료실에 업로드해 주세요.\n\n질문은 도입, 사용 맥락, 불편 경험, 기대 변화 순으로 최소 8문항 이상 준비하는 것을 권장합니다.\n\n초안 상태여도 괜찮지만 인터뷰 목적과 대상은 반드시 명시해 주세요."
      }
    ],
    roster: teacherServiceBlueprintRoster,
    teams: []
  }
];

export function getStudentClassroom(classId: string) {
  return studentClassrooms.find((classroom) => classroom.id === classId);
}

export function getTeacherClassroom(classId: string) {
  return teacherClassrooms.find((classroom) => classroom.id === classId);
}
