'use client'

import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"; // useState, useEffect 추가

export default function CommonHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // 10px만 내려도 감지
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. 메인 페이지 여부 확인
  const isMainPage = pathname === '/';

  // 2. 렌더링은 항상 하되, 메인이 아니면 숨김 (CSS)
  // * 중요: 'hidden'을 써야 컴포넌트가 Unmount되지 않고 상태(로그인 정보)를 유지함!
  return (
    <header 
        className={cn(
            `${isMainPage ? 'flex' : 'hidden'} items-center justify-between h-14 px-4 sticky top-0 z-[99] transition-all duration-300`,
            isScrolled 
                ? "bg-white/70 backdrop-blur-md border-b border-white/20" // 스크롤 시: 글래스모피즘
                : "bg-transparent border-b border-transparent" // 최상단: 완전 투명 & 보더 없음
        )}
    >
        <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-slate-900" />
            <span className="font-bold text-lg text-slate-900">WhoChooz</span>
        </Link>

    </header>
  );
}