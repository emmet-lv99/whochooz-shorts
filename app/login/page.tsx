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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-10 text-slate-800">
        로그인하고<br/>
        더 많은 혜택을 받아보세요!
      </h1>
      <button
        onClick={handleKakaoLogin}
        className="w-full max-w-[320px] h-14 bg-[#FEE500] text-[#000000 85%] rounded-md font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-5 h-5 fill-black" /> {/* 임시 카카오 심볼 */}
        카카오로 3초 만에 시작하기
      </button>
    </div>
  )
}
