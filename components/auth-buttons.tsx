'use client'

import authService from "@/app/_services/auth";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function AuthButtons() {
    const [user, setUser] = useState<User|null>(null)
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가

    const handleLogout = () => {
        authService.signOut()
        alert('로그아웃 되셨습니다.')
    }

    useEffect(()=>{
      // 1. 초기 상태
      authService.getCurrentUser().then((user) => {
        setUser(user)
        setIsLoading(false) // 로딩 완료
      })

      // 2. 구독 (service가 시키는 대로 cleanup 함)
      const unsubscribe = authService.onAuthStateChange((user) => {
        setUser(user)
        setIsLoading(false)
      })
      return () => unsubscribe()
    },[])

    // 로딩 중일 때 깜빡임 방지용 스켈레톤
    if (isLoading) {
        return <div className="w-20 h-9 bg-slate-100 rounded animate-pulse" />
    }

    if(user) {
      return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 hidden sm:inline">{user.email?.split('@')[0]}님</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-900" >로그아웃</Button>
      </div>
      )
    }    

    return (
        <Link href="/login">
            <Button>로그인/회원가입</Button>
        </Link>
    )
}