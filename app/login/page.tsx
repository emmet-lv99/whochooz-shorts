'use client'
// app/login/page.tsx

import { useModal } from "@/components/providers/modal-provider";
import { MessageCircle } from "lucide-react";
import authService from "../_services/auth";

export default function LoginPage() {
  const { open } = useModal();

  const handleKakaoLogin = async () => {
    const {error} = await authService.signInWithKakao()
    if(error) {
      open({
        title: '로그인 실패',
        content: '로그인 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.'
      });
    }
  }    

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      {/* 1. 고정 배경 (Fixed Background) - 스크롤 영향 없음 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[60%] h-[60%] rounded-full bg-indigo-300/30 blur-[120px] mix-blend-multiply" />
      </div>

      {/* 2. 스크롤 가능한 컨텐츠 영역 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-sm bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center pb-10">
          <h1 className="text-2xl font-bold mb-3 text-slate-900 leading-tight">
            로그인하고<br/>
            <span className="text-indigo-600">더 많은 혜택</span>을 받아보세요!
          </h1>
          <p className="text-slate-500 text-sm mb-10 break-keep">
            3초만에 가입하고 후추즈의 모든 기능을 이용해보세요.
          </p>

          <button
            onClick={handleKakaoLogin}
            className="w-full h-14 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] rounded-lg font-bold text-[17px] flex items-center justify-center gap-2 transition-colors active:scale-[0.98] border-glow"
          >
            <MessageCircle className="w-5 h-5 fill-[#191919] text-[#191919]" />
            카카오로 3초 만에 시작하기
          </button>
        </div>
      </div>
    </div>
  )
}
