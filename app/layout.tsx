import AuthButtons from "@/components/auth-buttons";
import { BottomNav } from "@/components/bottom-nav";
import { Link } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whochooz Shorts",
  description: "숏폼으로 즐기는 맛집 체험단",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">{/* 언어 설정 ko로 변경 */}
      <body
        className={`${inter.className} antialiased bg-slate-50 flex justify-center min-h-screen`}
      >
        {/* 모바일 뷰 컨테이너 (최대 너비 480px, 흰색 배경, 그림자) */}
        <div className="max-w-[480px] w-full bg-white min-h-screen relative shadow-2xl flex flex-col">
              {/* 🆕 공통 헤더 추가 */}
              <header className="flex items-center justify-between p-4 border-b h-14 bg-white sticky top-0 z-50">
                 <Link href="/" className="font-bold text-lg">WhoChooz</Link>
                 <AuthButtons />
              </header>
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
