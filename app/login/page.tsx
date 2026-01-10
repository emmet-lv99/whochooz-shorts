'use client'
// app/login/page.tsx

import { MessageCircle } from "lucide-react"
import authService from "../_services/auth"

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    const {error} = await authService.signInWithKakao()
    if(error) {
      alert('로그인에 실패했습니다.')
    }
  }    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-slate-50">
      {/* 1. 오로라 배경 효과 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[40%] w-[60%] h-[60%] rounded-full bg-indigo-300/30 blur-[120px] mix-blend-multiply" />

      {/* 2. 컨텐츠 (Glassmorphism Card) */}
      <div className="relative z-10 w-full max-w-sm bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-lg p-8 flex flex-col items-center text-center">
        {/* 로고 (옵션) */}
        <h1 className="text-2xl font-bold mb-3 text-slate-900 leading-tight">
          로그인하고<br/>
          <span className="text-indigo-600">더 많은 혜택</span>을 받아보세요!
        </h1>
        <p className="text-slate-500 text-sm mb-10 break-keep">
          3초만에 가입하고 후추즈의 모든 기능을 이용해보세요.
        </p>

        <button
          onClick={handleKakaoLogin}
          className="w-full h-14 bg-[#FEE500]/90 backdrop-blur-md border border-[#FEE500]/50 text-[#3C1E1E] rounded-lg font-bold text-[17px] flex items-center justify-center gap-2.5 hover:bg-[#FEE500] hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-[#3C1E1E] text-[#3C1E1E]" />
          카카오로 3초 만에 시작하기
        </button>
      </div>
    </div>
  )
}
