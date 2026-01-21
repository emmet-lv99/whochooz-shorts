"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import vipService from "@/app/_services/vip";

function VIPSuccessContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // 내 추천 코드 조회
  useEffect(() => {
    async function fetchCode() {
      if (!phone) {
        setIsLoading(false);
        return;
      }

      const result = await vipService.getMyReferralCode(phone);
      setReferralCode(result.code);
      setNickname(result.nickname || "");
      setIsLoading(false);
    }

    fetchCode();
  }, [phone]);

  // 클립보드 복사
  const handleCopyCode = async () => {
    if (!referralCode) return;

    const inviteUrl = `${window.location.origin}/vip?code=${referralCode}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 코드만 복사
  const handleCopyCodeOnly = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="vip-spinner mx-auto mb-6" />
          <p className="text-white/60 text-sm">멤버십을 활성화하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        {/* 성공 아이콘 */}
        <div className="animate-slide-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--vip-gold)]/10 border border-[var(--vip-gold)]/30 flex items-center justify-center animate-pulse-gold">
            <svg
              className="w-10 h-10 text-vip-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-serif-display text-3xl md:text-4xl text-white mb-2">
            Welcome{nickname ? `, ${nickname}` : ""}.
          </h1>
          <p className="text-white/60 mb-8">VIP 멤버십이 활성화되었습니다.</p>
        </div>

        {/* Founding Crew 안내 */}
        <div className="glass-card p-6 mb-6 animate-slide-up-delay-1">
          <div className="vip-badge mx-auto mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            FOUNDING CREW
          </div>

          <h2 className="text-white text-lg font-medium mb-2">
            당신을 Founding Crew로 임명합니다.
          </h2>
          <p className="text-white/50 text-sm">
            신뢰할 수 있는 동료 <span className="text-vip-gold font-semibold">3명</span>을 직접 초대하세요.
          </p>
        </div>

        {/* 내 코드 카드 */}
        {referralCode && (
          <div className="glass-card-gold p-6 animate-slide-up-delay-2">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
              Your Invite Code
            </p>

            <div
              onClick={handleCopyCodeOnly}
              className="bg-black/30 rounded-lg py-4 px-6 mb-4 cursor-pointer hover:bg-black/40 transition-colors"
            >
              <p className="font-mono text-2xl text-vip-gold tracking-widest">
                {referralCode}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="vip-button w-full flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copy Invite Link
            </button>

            <p className="text-white/30 text-xs mt-4">
              링크를 복사해서 동료에게 전달하세요
            </p>
          </div>
        )}

        {/* 안내 문구 */}
        <p className="text-white/30 text-xs mt-10 animate-slide-up-delay-3">
          정식 서비스 오픈 시 가장 먼저 안내드리겠습니다.
        </p>
      </div>

      {/* 토스트 메시지 */}
      <div className={`vip-toast ${showToast ? "show" : ""}`}>
        복사되었습니다
      </div>
    </div>
  );
}

// Suspense로 래핑 (useSearchParams 사용을 위해)
export default function VIPSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="vip-spinner" />
        </div>
      }
    >
      <VIPSuccessContent />
    </Suspense>
  );
}
