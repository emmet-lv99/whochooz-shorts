'use client';

import { useModalStore } from "@/app/_store/useModalStore";
import { cn } from "@/lib/utils";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DetailHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { open } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      // 10px 이상 스크롤되면 헤더 스타일 변경
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const currentUrl = window.location.href; // 현재 페이지 URL

    // 1. Web Share API 시도 (모바일 등)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: document.title || 'Whochooz Shorts',
          url: currentUrl,
        });
        return; // 공유 성공 시 종료
      } catch (err) {
        // 사용자가 취소했거나 에러인 경우 -> 아래 클립보드 복사로 진행 안 하고 중단하는 게 나음 (취소했는데 복사되었습니다 뜨면 이상함)
        // 단, 에러가 "AbortError"(유저 취소)가 아닐 때만 fallback 하는 게 좋음.
        // 여기선 단순하게 유저 취소면 아무 일도 안 일어나게 하고,
        // Share API 자체가 없는 환경은 if 문 밖으로 빠져서 실행됨.
        return; 
      }
    }

    // 2. Fallback: 클립보드 복사
    try {
      await navigator.clipboard.writeText(currentUrl);
      open({
        title: '링크 복사 완료',
        content: '클립보드에 링크가 복사되었습니다.',
        btnText: '확인'
      });
    } catch (err) {
      open({
        title: '공유 실패',
        content: '브라우저 보안 설정으로 인해\n링크를 복사할 수 없습니다.',
        btnText: '확인'
      });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 transition-all duration-300",
        isScrolled 
          ? "bg-white/70 backdrop-blur-xl border-b border-white/20" // 스크롤 시 Glassmorphism
          : "bg-transparent" // 초기 투명
      )}
    >
      {/* 뒤로가기 버튼 */}
      <Link href="/campaigns">
        <button 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-white/50 backdrop-blur-[2px] text-black hover:bg-white/80",
            isScrolled && "bg-transparent backdrop-blur-none hover:bg-slate-100"
          )}
        >
          <ArrowLeft size={20} />
        </button>
      </Link>

      {/* 공유하기 버튼 */}
      <button 
        onClick={handleShare}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-white/50 backdrop-blur-[2px] text-black hover:bg-white/80 active:scale-95",
          isScrolled && "bg-transparent backdrop-blur-none hover:bg-slate-100"
        )}
      >
        <Share2 size={20} />
      </button>
    </header>
  );
}
