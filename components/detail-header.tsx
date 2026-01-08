'use client';

import { cn } from "@/lib/utils";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DetailHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 50px 이상 스크롤되면 헤더 스타일 변경
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 transition-all duration-300",
        isScrolled 
          ? "bg-white/60 backdrop-blur-md border-b border-black/5" // 스크롤 시 Glassmorphism
          : "bg-transparent" // 초기 투명
      )}
    >
      {/* 뒤로가기 버튼 */}
      <Link href="/campaigns">
        <button 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-white/50 backdrop-blur-[2px] text-black",
            isScrolled && "bg-transparent backdrop-blur-none"
          )}
        >
          <ArrowLeft size={20} />
        </button>
      </Link>

      {/* 공유하기 버튼 */}
      <button 
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-white/50 backdrop-blur-[2px] text-black",
          isScrolled && "bg-transparent backdrop-blur-none"
        )}
      >
        <Share2 size={20} />
      </button>
    </header>
  );
}
