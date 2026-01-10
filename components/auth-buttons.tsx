'use client'

import authService from "@/app/_services/auth";
import { useModalStore } from "@/app/_store/useModalStore";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function AuthButtons() {
    const { open } = useModalStore();
    const [user, setUser] = useState<User|null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const handleLogout = () => {
        open({
            title: '로그아웃',
            content: '정말 로그아웃 하시겠습니까?',
            btnText: '로그아웃',
            cancelText: '취소',
            onConfirm: () => {
                authService.signOut()
            }
        });
    }

    useEffect(()=>{
      // 1. 초기 상태
      authService.getCurrentUser().then((user) => {
        setUser(user)
        setIsLoading(false)
      })

      // 2. 구독
      const unsubscribe = authService.onAuthStateChange((user) => {
        setUser(user)
        setIsLoading(false)
      })
      return () => unsubscribe()
    },[])

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