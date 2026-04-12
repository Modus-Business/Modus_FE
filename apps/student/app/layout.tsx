import type { Metadata } from "next";

import { AppShell } from "@modus/classroom-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Modus Student | 수강생 클래스룸",
    template: "%s | Modus Student",
  },
  description: "수강생을 위한 Modus 클래스룸 대시보드와 수업 참여 경험을 제공합니다.",
  applicationName: "Modus Student",
  keywords: ["Modus", "수강생", "클래스룸", "수업 참여", "모둠 활동"],
  openGraph: {
    title: "Modus Student | 수강생 클래스룸",
    description: "수강생을 위한 Modus 클래스룸 대시보드와 수업 참여 경험을 제공합니다.",
    siteName: "Modus Student",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Modus Student | 수강생 클래스룸",
    description: "수강생을 위한 Modus 클래스룸 대시보드와 수업 참여 경험을 제공합니다.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <AppShell role="student">{children}</AppShell>
      </body>
    </html>
  );
}
