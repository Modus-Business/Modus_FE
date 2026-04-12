import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Modus | 로그인 및 회원가입",
    template: "%s | Modus",
  },
  description: "Modus 클래스룸 서비스의 로그인 및 회원가입 허브입니다.",
  applicationName: "Modus",
  keywords: ["Modus", "클래스룸", "로그인", "회원가입", "교육 플랫폼"],
  openGraph: {
    title: "Modus | 로그인 및 회원가입",
    description: "Modus 클래스룸 서비스의 로그인 및 회원가입 허브입니다.",
    siteName: "Modus",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Modus | 로그인 및 회원가입",
    description: "Modus 클래스룸 서비스의 로그인 및 회원가입 허브입니다.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
