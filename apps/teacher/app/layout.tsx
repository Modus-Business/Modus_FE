import type { Metadata } from "next";
import { Toaster } from "sonner";

import { AppShell } from "@modus/classroom-ui";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Modus Teacher | 교강사 클래스룸",
    template: "%s | Modus Teacher",
  },
  description: "교강사를 위한 Modus 클래스룸 운영 대시보드와 공지 관리 경험을 제공합니다.",
  applicationName: "Modus Teacher",
  keywords: ["Modus", "교강사", "클래스룸", "수업 관리", "공지사항"],
  openGraph: {
    title: "Modus Teacher | 교강사 클래스룸",
    description: "교강사를 위한 Modus 클래스룸 운영 대시보드와 공지 관리 경험을 제공합니다.",
    siteName: "Modus Teacher",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Modus Teacher | 교강사 클래스룸",
    description: "교강사를 위한 Modus 클래스룸 운영 대시보드와 공지 관리 경험을 제공합니다.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AppShell role="teacher">{children}</AppShell>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
