'use client'

import { useAuthStore } from "@/app/_store/useAuthStore";
import { useModalStore } from "@/app/_store/useModalStore";
import Link from "next/link";
import { Button } from "./ui/button";

export default function AuthButtons() {
    const { open } = useModalStore();
    const { user, isLoading, logout } = useAuthStore();

    const handleLogout = () => {
        open({
            title: '로그아웃',
            content: '정말 로그아웃 하시겠습니까?',
            btnText: '로그아웃',
            cancelText: '취소',
            onConfirm: () => {
                logout(); // Store action 사용
            }
        });
    }

    if (isLoading) {
        return <div className="w-20 h-9 bg-slate-100 rounded animate-pulse" />
    }

    if(user) {
      return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 hidden sm:inline">{user.email?.split('@')[0]}님</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-900 active-press" >로그아웃</Button>
      </div>
      )
    }    

    return (
        <Link href="/login">
            <Button className="active-press bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-lg text-white/95 hover:text-white transition-all">
                로그인/회원가입
            </Button>
        </Link>
    )
}