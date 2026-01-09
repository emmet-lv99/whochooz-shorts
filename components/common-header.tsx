'use client'

import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "./auth-buttons";

export default function CommonHeader() {
  const pathname = usePathname();

  // 1. 메인 페이지 여부 확인
  const isMainPage = pathname === '/';

  // 2. 렌더링은 항상 하되, 메인이 아니면 숨김 (CSS)
  // * 중요: 'hidden'을 써야 컴포넌트가 Unmount되지 않고 상태(로그인 정보)를 유지함!
  return (
    <header className={`${isMainPage ? 'flex' : 'hidden'} items-center justify-between h-14 px-4 bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-[99] transition-all`}>
        <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-slate-900" />
            <span className="font-bold text-lg text-slate-900">WhoChooz</span>
        </Link>
        <div className="flex gap-2">
            <AuthButtons />
        </div>
    </header>
  );
}