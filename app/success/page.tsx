// app/success/page.tsx

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. 고정 배경 (Fixed Background) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/30 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* 2. 스크롤 가능한 컨텐츠 영역 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-sm bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-lg p-10 flex flex-col items-center text-center">
          
          {/* 체크 아이콘 (Glow Animation) */}
          <div className="mb-6 relative">
              <div className="absolute inset-0 bg-green-400 blur-xl opacity-40 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl flex items-center justify-center border-4 border-white/30">
                  <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
              </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            신청이 완료되었어요! 🎉
          </h1>
          
          <p className="text-slate-600 text-[15px] mb-10 leading-relaxed break-keep">
            브랜드에서 꼼꼼히 검토 후<br/>
            선정 결과를 알려드릴게요.
          </p>
          
          <div className="w-full space-y-3">
            <Link href="/" className="block">
              <Button className="w-full h-14 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all border border-white/10 backdrop-blur-md">
                홈으로 돌아가기
              </Button>
            </Link>
            
            <Link href="/mypage" className="block">
              <button className="w-full h-12 text-slate-500 font-medium text-sm hover:text-slate-900 transition-colors">
                신청 내역 확인하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    )
}
