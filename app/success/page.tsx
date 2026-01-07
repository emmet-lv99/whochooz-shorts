// app/success/page.tsx

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
          <div className="mb-6 animate-bounce">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          
            <h1 className="text-2xl font-bold text-slate-900 mb-2">신청이 완료되었습니다! 🎉</h1>
          
            <p className="text-slate-500 mb-10 leading-relaxed">지원서가 확인되면 빠른 시일 내에 연락 드리겠습니다.</p>
          
            <div className="w-full max-w-[280px]">
              <Link href="/">
                <Button>🏠 홈으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </div>
    )
}
