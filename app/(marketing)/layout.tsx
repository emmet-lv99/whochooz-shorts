import type { Metadata } from "next";
import "./marketing.css";

export const metadata: Metadata = {
  title: "WhoChooz VIP Club",
  description: "Founding Crew 초대장",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Playfair Display 폰트 (Head에 추가) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* VIP 전용 전체화면 레이아웃 (기존 서비스 UI 완전 덮어씌움) */}
      <div className="fixed inset-0 z-50 bg-vip-black text-white overflow-auto">
        {/* 배경 패턴 */}
        <div className="vip-background" />

        {/* 콘텐츠 */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
