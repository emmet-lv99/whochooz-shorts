import { BottomNav } from "@/components/bottom-nav";
import CommonHeader from "@/components/common-header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        {/* 카카오 지도 SDK (전역 로드) */}
        <Script 
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive" 
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-slate-50 flex justify-center min-h-screen`}
      >
        {/* 모바일 뷰 컨테이너 (최대 너비 480px, 흰색 배경, 그림자) */}
        <div className="max-w-[480px] w-full bg-white min-h-screen relative shadow-2xl flex flex-col">
          {/* 🆕 공통 헤더 추가 */}
          <CommonHeader />
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
