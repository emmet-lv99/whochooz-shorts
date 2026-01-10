'use client'

import authService from "@/app/_services/auth"
import { useAuthStore } from "@/app/_store/useAuthStore"
import { useEffect } from "react"

export default function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    // 1. 초기 로드 시 체크
    const initAuth = async () => {
        const user = await authService.getCurrentUser();
        // user가 null이어도 상태 업데이트 (로딩 해제)
        setUser(user);
    };
    initAuth();

    // 2. 인증 상태 변경 구독 (로그인/로그아웃)
    const unsubscribe = authService.onAuthStateChange((user) => {
        setUser(user);
    });

    return () => {
        if (typeof unsubscribe === 'function') unsubscribe(); 
        // authService.onAuthStateChange가 함수를 반환한다고 가정 (또는 객체 내부 unsubscribe)
        // 기존 코드: return () => unsubscribe()
    }
  }, [setUser])

  return null;
}
