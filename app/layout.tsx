import AuthListener from "@/components/auth-listener";
import { BottomNav } from "@/components/bottom-nav";
import CommonHeader from "@/components/common-header";
import GlobalModal from "@/components/global-modal";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="ko">
      <head>
        {/* Pretendard Font (CDN) */}
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css" />
        
        {/* 카카오 지도 SDK (전역 로드) */}
        <Script 
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive" 
        />
      </head>
      <body
        className={`font-[Pretendard] antialiased bg-slate-50 flex justify-center min-h-screen`}
      >
        {/* 모바일 뷰 컨테이너 (최대 너비 480px, 흰색 배경, 그림자) */}
        <div className="max-w-[480px] w-full min-h-screen relative shadow-2xl flex flex-col">
            <AuthListener />
            <CommonHeader />
            {children}
            <BottomNav />
            <GlobalModal />
        </div>
      </body>
    </html>
  );
}
